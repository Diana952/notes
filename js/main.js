let eventBus = new Vue ()

Vue.component('desk', {
    template: `
    <div class='desk'>
        <createTask></createTask>
        <div>
            <col1></col1>
            <col2></col2>
            <col3></col3>
        </div>
    </div>
    `,

})


Vue.component('col3', {
    template: `
            <div class="col">
            <h2>100% выполнено</h2>
               <div>
                    <div v-if='allDoneTasks' v-for="task in allDoneTasks" class="col-item">
                        <p class="task-list-name">{{ task.list_name }}</p>
                        <div v-for="t in task.tasks">
                                <p v-bind:class="{ done: t.status }"> {{ t.task1 }}</p>
                                <p v-bind:class="{ done: t.status }"> {{ t.task2 }}</p>
                                <p v-bind:class="{ done: t.status }"> {{ t.task3 }}</p>
                                <p v-bind:class="{ done: t.status }"> {{ t.task4 }}</p>
                                <p v-bind:class="{ done: t.status }"> {{ t.task5 }}</p>
                        </div>
                    </div>
                
            </div>
            <div v-if="errors" v-for="error in errors" class="errors"">
                <p>{{ error }}</p>
            </div>
            </div>
        
    `,
    data (){
        return {

            allDoneTasks: [],
            errors: []
        }
    },

    methods: {

    },
    mounted() {
            {
                eventBus.$on('allDone', data => {
                        this.errors = [];
                        this.allDoneTasks.push(data);
                    }
                )
            }
        }
})

Vue.component('col2', {
    template: `
        
        <div class="col">
        <h2>50% выполнено</h2>
            <div>
                    <div v-for="task in secondDoneTasks" class="col-item">
                        <p class="task-list-name">{{ task.list_name }}</p>
                        <div v-for="t in task.tasks">
                                <p @click="allDoneTask(task, t)" v-bind:class="{ done: t.status }"> {{ t.task1 }}</p>
                                <p @click="allDoneTask(task, t)" v-bind:class="{ done: t.status }"> {{ t.task2 }}</p>
                                <p @click="allDoneTask(task, t)" v-bind:class="{ done: t.status }"> {{ t.task3 }}</p>
                                <p @click="allDoneTask(task, t)" v-bind:class="{ done: t.status }"> {{ t.task4 }}</p>
                                <p @click="allDoneTask(task, t)" v-bind:class="{ done: t.status }"> {{ t.task5 }}</p>
                        </div>
                    </div>
                
            </div>
            <div v-if="errors" v-for="error in errors" class="errors"">
                <p>{{ error }}</p>
            </div>
        </div>
        
    `,
    data () {
        return {
            secondDoneTasks: [],
            errors: []
        }
    },
    methods: {
        allDoneTask(list, task){
            if (task.status === false) {
                task.status = true;
                list.done++;
            }

            if ((list.done / list.tasks.length) * 100 === 100) {
                console.log((list.done / list.tasks.length) * 100);
                eventBus.$emit('allDone', list);
                this.secondDoneTasks.splice(this.secondDoneTasks.indexOf(list), 1);
                console.log(2);
            }
        }
    },
    mounted() {
        {
            eventBus.$on('semiDone', data => {
                    this.errors = [];
                    if (this.secondDoneTasks.length < 5) {
                        this.secondDoneTasks.push(data);
                    } else {
                        this.errors.push('Вы еще не завершили предыдущие задачи');
                    }
                }
              
            )
        }
    
    },

})


Vue.component('col1', {
    template: `
        <div class="col">
        <h2>0% выполнено</h2>
            <div>
                
                    <div v-for="task in firstColTasks" class="col-item">
                        <p class="task-list-name">{{ task.list_name }}</p>
                        <div v-for="t in task.tasks">
                                <p @click="doneTask(task, t)" v-bind:class="{ done: t.status }"> {{ t.task1 }}</p>
                                <p @click="doneTask(task, t)" v-bind:class="{ done: t.status }"> {{ t.task2 }}</p>
                                <p @click="doneTask(task, t)" v-bind:class="{ done: t.status }"> {{ t.task3 }}</p>
                                <p @click="doneTask(task, t)" v-bind:class="{ done: t.status }"> {{ t.task4 }}</p>
                                <p @click="doneTask(task, t)" v-bind:class="{ done: t.status }"> {{ t.task5 }}</p>
                        </div>
                    </div>
                
            </div>
            <div v-if="errors" v-for="error in errors" class="errors"">
                <p>{{ error }}</p>
            </div>
        </div>
    `,
    data() {
        return {
            selectedTask:null,
            firstColTasks:[],
            errors: []
        }
    },
    methods: {
        doneTask(list, task){
            if (task.status === false) {
                task.status = true;
                list.done++;
            }

            if ( (list.done / list.tasks.length) * 100 >= 50) {
                eventBus.$emit('semiDone', list);
                this.firstColTasks.splice(this.firstColTasks.indexOf(list), 1);
            }
        }
    },
    mounted() {
       {
            eventBus.$on('task_list', data => {
                this.errors = [];
                    if (this.firstColTasks.length < 3) {
                        this.firstColTasks.push(data);
                    } else {
                        this.errors.push('Вы еще не завершили предыдущие задачи');
                    }
                }
            )
            }
    },
})


Vue.component('createTask', {
    template:`
        <form @submit.prevent="onSubmit">
        <h2>Создать список</h2>
            <label class="list_name" for="list_name">Название</label>
            <input type="text" v-model="list_name" id="list_name">
             <p>Задачи</p>
            <input type="text" v-model="task1" id="task1">      
            
            
            <input type="text" v-model="task2" id="task2"> 
            
           
            <input type="text" v-model="task3" id="task3">    
            
            
            <input type="text" v-model="task4" id="task4">
            
            <input type="text" v-model="task5" id="task5">                 
            
            <input type="submit" class="btn">
        </form>
    `,
    data () {
        return {
            list_name: null,
            task1: null,
            task2: null,
            task3: null,
            task4: null,
            task5: null
        }
    },
    methods: {
        onSubmit(){
            let taskList = {
                list_name: this.list_name,
                tasks: [
                    {task1: this.task1, status:false},
                    {task2: this.task2, status:false},
                    {task3: this.task3, status:false},
                    {task4: this.task4, status:false},
                    {task5: this.task5, status:false},
                ],
                done: 0
            }
            eventBus.$emit('task_list', taskList);
            this.list_name = null;
            this.task1 = this.task2 = this.task3 = this.task4 = this.task5 = null;
        }
    }
})


let app = new Vue({
    el: '#app',
    data: {
        name: 'Заметки'
    }
})