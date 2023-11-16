let eventBus = new Vue ()

Vue.component('add_task_form', {
    template: `
    <form @submit.prevent="addTask">
        <input name="task_txt"  v-model="task_txt" id="task_txt">
        <input type="submit" value="Submit">
    </form>
    `,
    data() {
        return {
            task:'',
            task_txt: null,
            task_status: false
        }
    },
    method: {
        addTask(){
                let task = {
                    task_txt : this.task_txt,
                    task_status: false
                }
                eventBus.$emit('task-insert', task);
                this.task_txt = null;
        }
    }
})


Vue.component('task_desk', {
    template:`
    <div>
    <add_task_form></add_task_form>
    <div class="task-list">
        <ul>
            <li v-for="task in task_list"><p>{{ task.task_txt }}</p></li>
        </ul>
    </div>
    </div>
    `,
    data() {
        return {
            task_list: []
        }
    },
    mounted() {
        eventBus.$on('task-insert', task => {
            this.task_list.push(task);
        })
    }
})

// Приложение

let app = new Vue({
    el: '#app',
})    