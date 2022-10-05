(function () {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2')
        appTitle.textContent = title
        return appTitle
    }

    function createTodoItemForm() {
        let form = document.createElement('form')
        let input = document.createElement('input')
        let buttonWrapper = document.createElement('div')
        let button = document.createElement('button')

        form.classList.add('input-group', 'mb-3')
        input.classList.add('form-control')
        input.placeholder = "Введите название нового дела"
        buttonWrapper.classList.add('input-group-append')
        button.classList.add('btn', 'btn-primary')
        button.textContent = "Добавить дело"
        button.disabled = true

        input.addEventListener('input', function () {
            button.disabled = (input.value === '')
        })

        buttonWrapper.append(button)
        form.append(input)
        form.append(buttonWrapper)

        return {
            form,
            input,
            button
        }
    }

    function createTodoList() {
        let list = document.createElement('ul')
        list.classList.add('list-group')
        return list
    }

    function createTodoItem(name, onDoneChanged, onDelete, done = false) {
        let item = document.createElement('li')

        let buttonGroup = document.createElement('div')
        let doneButton = document.createElement('button')
        let deleteButton = document.createElement('button')

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
        if (done) {
            item.classList.add('list-group-item-success')
        }
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success')
        doneButton.textContent = 'Готово'
        deleteButton.classList.add('btn', 'btn-danger')
        deleteButton.textContent = 'Удалить'

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup)

        doneButton.addEventListener('click', function () {
            onDoneChanged(item)
        });
        deleteButton.addEventListener('click', function () {
            onDelete(item)
        })

        return {
            item,
            doneButton,
            deleteButton
        }
    }

    function createTodoApp(container, title="Список дел", listId) {
        function onDoneChanged(item) {
            let itemIndex = [...todoList.children].indexOf(item)
            todoLocalStorage.swapDoneStatus(listId, itemIndex)
            item.classList.toggle('list-group-item-success')
        }

        function onDeleteItem(item) {
            let itemIndex = [...todoList.children].indexOf(item)
            todoLocalStorage.remove(listId, itemIndex)
            if (confirm('Вы уверены?')) {
                item.remove()
            }
        }

        let todoAppTitle = createAppTitle(title)
        let todoItemForm = createTodoItemForm()
        let todoList = createTodoList()

        let defaultTodos = todoLocalStorage.getAll(listId)
        if (defaultTodos == null) {
            defaultTodos = []
        }
        for (let todo of defaultTodos) {
            let name = todo['name']
            let done = todo['done']
            let item = createTodoItem(name, onDoneChanged, onDeleteItem, done).item
            todoList.append(item)
        }

        container.append(todoAppTitle)
        container.append(todoItemForm.form)
        container.append(todoList)

        // браузер создаёт событие submit на форме по нажатию на Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function (e) {
            //  эта строчка необходима, чтобы предотвратить стандартное действия браузера
            // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            // игнорируем создание элемента, если пользователь ничего не ввёл в поле
            if (!todoItemForm.input.value) {
                return;
            }

            let taskName = todoItemForm.input.value
            let todoItem = createTodoItem(taskName, onDoneChanged, onDeleteItem);
            todoLocalStorage.add(listId, taskName)
            //  создаём и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);
            // обнуляем значение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = '';
        });
    }

    window.createTodoApp = createTodoApp
})();