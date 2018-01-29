const jsxSyntax = require('babel-plugin-syntax-jsx')

module.exports = function ({ types: t }) {
  return {
    inherits: jsxSyntax,
    visitor: {
      'ClassDeclaration|ClassExpression' (path, state) {
        if (path.node.superClass.object.name === 'React') {
          if (path.node.id) {
            console.log(path.node.id.name)
          }
          path.traverse(methodPropFinder(t, state))
          path.skip()
        }
      }
    }
  }
}

const findMembersOf = (identifiers, state, t) => {
  var thisBindings = ['self']
  return {
    MemberExpression (path) {
      thisBindings = thisBindings.concat(
        Object.keys(path.scope.bindings)
          .filter(name => {
            const bindingPath = path.scope.bindings[name].path
            return (
              bindingPath.isVariableDeclarator() &&
              bindingPath.get('init').isThisExpression() &&
              bindingPath.get('id').isIdentifier()
            )
          })
          .map(name => path.scope.bindings[name].path.node.id.name)
      )
      identifiers = identifiers.concat(
        Object.keys(path.scope.bindings)
          .filter(name => {
            const bindingPath = path.scope.bindings[name].path
            return (
              bindingPath.isVariableDeclarator() &&
              thisBindings.some(i =>
                isPropsOfClass(bindingPath.node.init, t, i)
              ) &&
              bindingPath.get('id').isIdentifier()
            )
          })
          .map(name => path.scope.bindings[name].path.node.id.name)
      )
      if (isMemberOf(path.node, identifiers, thisBindings, t)) {
        addProp(state, path.node.property.name)
      }
    },
    VariableDeclarator (path) {
      if (
        identifiers.some(i => t.isIdentifier(path.node.init, { name: i })) ||
        isPropsOfClass(path.node.init, t)
      ) {
        if (t.isObjectPattern(path.node.id)) {
          path.node.id.properties
            .filter(p => t.isIdentifier(p.key))
            .forEach(objectProp => {
              addProp(state, objectProp.key.name)
            })
        }
      }
    }
  }
}

const methodPropFinder = (t, state) => ({
  ClassMethod (path) {
    var identifiers = []
    if (isMethodWithPropParams(path.node.key.name)) {
      if (path.node.params.length && t.isIdentifier(path.node.params[0])) {
        identifiers.push(path.node.params[0].name)
      }
      if (path.node.params.length && t.isObjectPattern(path.node.params[0])) {
        path.node.params[0].properties
          .filter(p => t.isIdentifier(p.key))
          .forEach(objectProp => {
            addProp(state, objectProp.key.name)
          })
      }
    }
    path.traverse(findMembersOf(identifiers, state, t))
  }
})

function isMethodWithPropParams (methodName) {
  return [
    'constructor',
    'componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'componentDidUpdate'
  ].includes(methodName)
}

function isPropsOfClass (object, t, thisIdentifier = 'self') {
  return (
    object &&
    t.isMemberExpression(object) &&
    (t.isThisExpression(object.object) ||
      t.isIdentifier(object.object, { name: thisIdentifier })) &&
    t.isIdentifier(object.property, { name: 'props' })
  )
}

function isMemberOf (node, identifiers, thisBindings, t) {
  const object = node.object
  return (
    thisBindings.some(i => isPropsOfClass(object, t, i)) ||
    identifiers.some(i => t.isIdentifier(object, { name: i }))
  )
}

function addProp (state, prop) {
  if (!state.file.metadata.props) {
    state.file.metadata.props = new Set()
  }
  state.file.metadata.props.add(prop)
}
