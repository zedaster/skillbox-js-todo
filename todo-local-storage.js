(function () {
    const todoLocalStorage = {}

    todoLocalStorage.add = function (listId, name, done = false) {
        let key = `todo-list-${listId}`
        let todos = JSON.parse(localStorage.getItem(key))
        if (todos == null) {
            todos = []
        }
        todos.push({name: name, done: done})
        let newJson = JSON.stringify(todos)
        localStorage.setItem(key, newJson)
    }

    todoLocalStorage.remove = function (listId, elementIndex) {
        let key = `todo-list-${listId}`
        let todos = JSON.parse(localStorage.getItem(key))
        let newTodos = []
        for (let i = 0; i < todos.length; i++) {
            if (i === elementIndex) {
                continue
            }
            newTodos.push(todos[i])
        }
        let newJson = JSON.stringify(newTodos)
        localStorage.setItem(key, newJson)
    }

    todoLocalStorage.swapDoneStatus = function (listId, elementIndex) {
        let key = `todo-list-${listId}`
        let todos = JSON.parse(localStorage.getItem(key))
        let currentTodo = todos[elementIndex]
        currentTodo.done = !currentTodo.done
        let newJson = JSON.stringify(todos)
        localStorage.setItem(key, newJson)
    }

    todoLocalStorage.getAll = function (listId) {
        let key = `todo-list-${listId}`
        let items = JSON.parse(localStorage.getItem(key))
        console.log(items)
        return items
    }

    window.todoLocalStorage = todoLocalStorage
})();