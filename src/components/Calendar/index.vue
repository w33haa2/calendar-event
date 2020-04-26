<template>
  <div class="container-fluid">
      <br>
    <b-card  title="Calendar">
        <b-row>
            <b-col lg="4">
                <b-row>
                    <b-col lg="12">
                    <label for="event-name">Event Name</label>
                        <b-form-input id="event-name" v-model="name" class="mb-2"></b-form-input>
                    </b-col>
                </b-row>
               <b-row>
                    <b-col lg="6">
                        <label for="example-datepicker">From</label>
                        <b-form-datepicker id="example-datepicker" v-model="fromDate" class="mb-2"></b-form-datepicker>
                    </b-col>
                    <b-col lg="6">
                        <label for="example-datepicker1">To</label>
                        <b-form-datepicker id="example-datepicker1" v-model="toDate" class="mb-2"></b-form-datepicker>
                    </b-col>
               </b-row>
               <b-row class="pb-2">
                   <b-col lg="12">
                        <b-form-checkbox-group
                            id="checkbox-group-1"
                            v-model="selectedDays"
                            :options="days"
                            name="flavour-1"
                        ></b-form-checkbox-group>
                   </b-col>
               </b-row>
               <b-row>
                   <b-col lg="12">
                       <b-button :disabled="postState" variant="primary" @click="onSubmit"> Save </b-button>
                   </b-col>
               </b-row>
            </b-col>
            <b-col lg="8">
                <b-row v-if="fetchState" class="justify-content-center center-load" >
                    <span ><i  class="fa fa-spinner fa-spin fa-3x"></i></span>
                </b-row>
                <vue-scheduler :events="calendarEvents" event-display="name" disableDialog/>
            </b-col>
        </b-row>
    </b-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
      return {
        selectedDays: [], 
        days: [
            { text: 'Monday', value: 'monday' },
            { text: 'Tuesday', value: 'tuesday' },
            { text: 'Wednesday', value: 'wednesday' },
            { text: 'Thursday', value: 'thursday' },
            { text: 'Friday', value: 'friday' },
            { text: 'Saturday', value: 'saturday' },
            { text: 'Sunday', value: 'sunday' },
        ],
        fromDate: null,
        toDate: null,
        events: [],
        fetchState: false,
        postState: false,
        name: null,
      }
  },
  computed: {
      calendarEvents() {
          if(this.events.length > 0) {
              return this.events.map(e => ({
                  date: e.event_date,
                  name: e.name,
              }))
          } else {
              return []
          }
      }
  },
  mounted() {
      this.getEvents()
  },
  methods: {
        calculateInBetweenDates(startDate, endDate) {
            let sDate = this.$moment(startDate)
            let eDate = this.$moment(endDate)
            let now = sDate, dates = [];
            
            while (now.isSameOrBefore(eDate)) {
                    dates.push(now.format('YYYY-MM-DD'));
                    now.add(1, 'days');
                }
            return dates;
        },

        onSubmit(){
            if(this.name == null || this.name == "") {
                return this.$swal(
                    'Oh No!',
                    'Event Name is required!',
                    'error'
                )
            }
            if(this.fromDate == null || this.fromDate == "") {
                return this.$swal(
                    'Oh No!',
                    'Start Date is required!',
                    'error'
                )
            }
            if(this.toDate == null || this.toDate == "") {
                return this.$swal(
                    'Oh No!',
                    'Start Date is required!',
                    'error'
                )
            }
            if(this.$moment(this.fromDate).diff(this.$moment(this.toDate)) > 0) {
                return this.$swal(
                    'Oh No!',
                    'End date should be greater than the start date!',
                    'error'
                )
            }
            this.postState = true
            let daysBetween = this.calculateInBetweenDates(this.fromDate, this.toDate)
            if(this.selectedDays.length > 0) {
                daysBetween = daysBetween.filter(e => this.selectedDays.includes(this.$moment(e).format('dddd').toLowerCase()))
            }
            const data = daysBetween.map(e => ({
                    name: this.name,
                    event_date: e
                }))
            this.postEvent(data)
        },

        postEvent(data) {
            axios.post('https://api-calendar-events.herokuapp.com/api/events/bulk', {
                events: data
            })
            .then(() => {
                this.postState = false
                this.getEvents()
                return this.$swal(
                    'Success!',
                    'Successfully created events!',
                    'success'
                )
            })
            .catch(() => {
                this.postState = false
                return this.$swal(
                    'Oh No!',
                    'Something went wrong!',
                    'error'
                )
            });
        },

        getEvents() {
            this.fetchState = true
            axios.get('https://api-calendar-events.herokuapp.com/api/events')
            .then((response) => {
                this.events = response.data.meta
                this.fetchState = false
            })
            .catch(() => {
                this.events = []
                this.fetchState = false
            })
        }
  }
}
</script>

<style scoped>
.center-load {
    position: absolute;
    top: 45%;
    left: 51%;
    z-index: 10;
}
</style>
