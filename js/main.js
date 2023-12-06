let eventBus = new Vue ()

Vue.component('desk', {
    template: `
    <div class='desk'>
<div>
     <createTask></createTask>
     <div>
         <col1></col1>
         <col2></col2>
         <col3></col3>
     </div>
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
                        <p v-bind:class="{ done: t.status }"> {{ t.task }}</p>
                        </div>
                        <p>{{ task.date }}</p>
                    </div>
                
            </div>
            </div>
        
    `,
    data (){
        return {

            allDoneTasks: [],
        }
    },

    mounted() {
        this.allDoneTasks = JSON.parse(localStorage.getItem("allDoneTasks")) || [];
        {
            eventBus.$on('allDone', data => {
                    data.date = new Date(); 
                    this.allDoneTasks.push(data);
                    localStorage.setItem('allDoneTasks', JSON.stringify(this.allDoneTasks));
                }
            )


        }},
    watch: {
        allDoneTask: {
            handler(newValue, oldValue) {
                localStorage.setItem('allDoneTask', JSON.stringify(newValue));
            },
            deep: true
        }
    }
})

Vue.component('col2', {
    template: `
        
        <div class="col">
        <div v-if="errors" v-for="error in errors" class="errors" id="errors">
        <p>{{ error }}</p>
     </div>
        <h2>50% выполнено</h2>
        <div v-bind:class="{ disables: errors}">
                    <div v-for="task in secondDoneTasks" class="col-item">
                        <p class="task-list-name">{{ task.list_name }}</p>
                        <div v-for="t in task.tasks">
                        <p @click="allDoneTask(task, t)" v-bind:class="{ done: t.status }"> {{ t.task }}</p>
                        </div>
                    </div>
                
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
                task.status += 1;
                list.done++;
            }
            let count = 0;
            for (let i = 0; i < 5; ++i) {
                if (list.tasks[i].task !== null) {
                    count++;
                }
            }
            if ((list.done / count) * 100 === 100) {
                eventBus.$emit('allDone', list);
                this.secondDoneTasks.splice(this.secondDoneTasks.indexOf(list), 1);
            }
          
        }
    },
    mounted() {
        this.secondDoneTasks = JSON.parse(localStorage.getItem('secondDoneTasks')) || [];
        {
            eventBus.$on('semiDone', list => {
                    if (this.secondDoneTasks.length < 5) {
                        this.secondDoneTasks.push(list);
                    } else if (this.errors.length < 1){
                        this.errors.push('Вы еще не выполнили предыдущие задачи');
                    } 
                }
              
            )
        }
    
    },
    watch: {
        secondDoneTasks: {
            handler(newValue, oldValue) {
                if (this.secondDoneTasks.length < 5){
                    this.errors.splice(0, this.errors.length);
                }
                localStorage.setItem('secondDoneTasks', JSON.stringify(newValue));
            },
            deep: true
        }
    }

})


Vue.component('col1', {
    template: `
        <div class="col">
        <div v-if="errors" v-for="error in errors" class="errors"">
        <p>{{ error }}</p>
        </div>
        <h2>0% выполнено</h2>
        <div v-bind:class="{ disabled: block }">
                
                    <div v-for="task in firstColTasks" class="col-item">
                        <p class="task-list-name">{{ task.list_name }}</p>
                        <div v-for="t in task.tasks">
                        <p @click="doneTask(task, t)" v-bind:class="{ done: t.status }"> {{ t.task }}</p>
                        </div>
                    </div>
                
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

            let count = 0;

            for (let i = 0; i < 5; ++i) {
                if (list.tasks[i].task !== null) {
                    count++;
                }
            }

            if (list.done / count * 100 >= 50){
                eventBus.$emit('semiDone', list);
                this.firstColTasks.splice(this.firstColTasks.indexOf(list), 1);
            }
        }
    },
    mounted() {
        this.firstColTasks = JSON.parse(localStorage.getItem("firstColTasks")) || [];
       {
            eventBus.$on('task_list', data => {
                    if (this.firstColTasks.length < 3) {
                        this.firstColTasks.push(data);
                    } else if (this.errors.length < 1){
                        this.errors.push('Вы еще не выполнили предыдущие задачи');
                    }
                }
            )
            }
    },
    watch: {
        firstColTasks: {
            handler(newValue, oldValue) {
            if (this.firstColTasks.length < 3){
                this.errors.splice(0, this.errors.length);
            }
            localStorage.setItem('firstColTasks', JSON.stringify(newValue));
        },
        deep: true
        }
    }
})


Vue.component('createTask', {
    template:`
        <form @submit.prevent="onSubmit">
        <h2>Создать список</h2>
            <label class="list_name" for="list_name">Название</label>
            <input type="text" v-model="list_name" id="list_name" required>
             <p>Задачи</p>
            <input type="text" v-model="task1" id="task1" required>      
            
            
            <input type="text" v-model="task2" id="task2" required> 
            
           
            <input type="text" v-model="task3" id="task3" required>    
            
            
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
                    {task: this.task1, status:false},
                    {task: this.task2, status:false},
                    {task: this.task3, status:false},
                    {task: this.task4, status:false},
                    {task: this.task5, status:false},
                ],
                done: 0,
                date: null
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