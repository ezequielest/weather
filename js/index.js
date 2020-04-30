var app = new Vue({
    el: '#app',
    data() {
        return {
        loading: true,
        iconsDay: [
            {200: 'cloudy-rain-lightning'},
            {201: 'cloudy-rain-lightning'},
            {202: 'cloudy-rain-lightning'},
            {230: 'cloudy-lightning'},
            {232: 'cloudy-lightning'},
            {233: 'cloudy-lightning'},
            {300: 'snow'},
            {301: 'snow'},
            {302: 'snow'},
            {500: 'rainy'},
            {501: 'rainy'},
            {501: 'rainy'},
            {511: 'rainy'},
            {520: 'rainy'},
            {521: 'rainy'},
            {522: 'rainy'},
            {600: 'snow'},
            {601: 'snow'},
            {602: 'snow'},
            {610: 'snow'},
            {611: 'wind'},
            {612: 'wind'},
            {621: 'snow'},
            {622: 'snow'},
            {623: 'snow'},
            {711: 'niebla'},
            {721: 'niebla'},
            {731: 'niebla'},
            {741: 'niebla'},
            {751: 'niebla'},
            {800: 'clean'},
            {801: 'clouds-sun'},
            {802: 'clouds-sun'},
            {803: 'clouds-sun'},
            {804: 'cloudy'},
            {900: 'rainy'},
         ],
         key: 'f3acb947fe9a4601aaca23a79e0e7bb4',
         currentWeather: null,
         codeWeather: null,
         currentTime: null,
         windSpeed: null,
         iconSelected: null,
         isNight: false,
         currentForecast: null,
         forecast: [],
         iconsForecast: []
        }
    },
    methods: { 
        isNightHour(){
            let hr = (new Date()).getHours();
            return (hr > 20 || hr < 5) ? true : false;
        },
        isCloudy(serchInto,forecastday) {
            let code = forecastday ? forecastday.weather.code : this.codeWeather;
            return serchInto[code] === 'cloudy' ? true : false;    
        },   
        isRainy(serchInto,forecastday) {
            let code = forecastday ? forecastday.weather.code : this.codeWeather;
            return serchInto[code] === 'rainy' ? true : false;        
            
        },    
        isCloudsSun(serchInto,forecastday) {
            let code = forecastday ? forecastday.weather.code : this.codeWeather;
            return serchInto[code] === 'clouds-sun' ? true : false;        
        }, 
        isCloudLightning(serchInto,forecastday) {
            let code = forecastday ? forecastday.weather.code : this.codeWeather;
            return serchInto[code] === 'cloudy-lightning' ? true : false;        
        }, 
        isCloudRainLightning(serchInto,forecastday){
            let code = forecastday ? forecastday.weather.code : this.codeWeather;
            return serchInto[code] === 'cloudy-rain-lightning' ? true : false;  
        },
        isClean(serchInto,forecastday) {
            let code = forecastday ? forecastday.weather.code : this.codeWeather;
            return serchInto[code] === 'clean' ? true : false;
        },
        isSnowy(serchInto,forecastday){
            let code = forecastday ? forecastday.weather.code : this.codeWeather;
            return serchInto[code] === 'snow' ? true : false;  
        },
        getForecast: function() {
            let daysForecast = 4;

            axios
                .get(`https://api.weatherbit.io/v2.0/forecast/daily?postal_code=7600&days=${daysForecast}&key=${this.key}`)
                .then(response => {
                    this.currentForecast = response.data.data[0];
                    this.forecast = response.data.data.slice(1,daysForecast);

                    this.iconsForecast = [];
                    
                    this.forecast.forEach((day)=> {
                        this.iconsForecast.push(this.iconsDay.filter((icon) => {
                            return icon[day.weather.code]
                        })[0]);
                    })
    
                })
                .catch(error => {
                    console.log(error)
                    this.errored = true
                })
                .finally(() => this.loading = false);
                
        },
        updateTime: function() {
            axios
                .get(`https://api.weatherbit.io/v2.0/current?city=Mar%20del%20Plata&country=Argentina&state=Buenos%20Aires&key=${this.key}`)
                .then(response => {
                    this.currentWeather = response.data.data[0];
                    this.codeWeather = response.data.data[0].weather.code;
                    this.windSpeed = Math.round(this.currentWeather.wind_spd * 3.6);

                    this.iconSelected = this.iconsDay.filter((icon) => {
                        return icon[this.codeWeather]
                    })[0];

                    this.loading = false;
                })
                .catch(error => {
                    console.log(error)
                    this.errored = true
                })
                .finally(() => this.loading = false);
                }
    },
    mounted () {
        this.updateTime();
        this.getForecast();
        this.isNight = this.isNightHour();

        setInterval(() => {
            let currentTime = new Date();
            this.currentTime =  moment(currentTime).format('DD/MM/YYYY')
        }, 1000);
                
        setInterval(() => {
            this.updateTime();
            this.isNight = this.isNightHour();
        }, 300000);
    },
    filters: {
        getDateName: function (value) {
            let days = ['Domingo','Lunes', 'Martes','Miércoles','Jueves','Viernes','Sábado'];
            if (!value) return '';
            value = moment(value).format('e');
            value = days[parseInt(value)];
            return value
        }
    }


})