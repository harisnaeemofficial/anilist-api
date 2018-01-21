const axios = require('axios');
const parser = require('set-cookie-parser')
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();


class Anilist {
    init() {
        this.headers = {'authority': 'anilist.co'}
        return axios.get('https://anilist.co/browse/anime', {
            jar: cookieJar,
            withCredentials: true
        }
        ).then((response) => {
            const cookies = parser.parse(response.headers['set-cookie'])
            for (var i = 0; i < cookies.length; i++){
                if(cookies[i].name == 'XSRF-TOKEN') {
                    this.headers['x-csrf-token'] = cookies[i].value
                }
            }
        });
    }

    get_season(month) {
        // Between January and March
        if (month >= 0 && month < 3)
            return 'Winter'
        // Between April and June
        if (month >= 3 && month < 6)
            return 'Spring'
        // Between July and September
        if (month >= 6 && month < 9)
            return 'Summer'
        // Between October and December
        return 'Fall'
    }

    get_season_releases() {
        var date = new Date()
        var year = date.getFullYear()
        var month = this.get_season(date.getMonth())
        return axios.get(
            'https://anilist.co/api/browse/anime',
            {
                params: {
                    'sort'  : 'popularity-desc',
                    'year'  : year,
                    'status': 'Currently Airing',
                    'season': month,
                    'airing_data': 'true'
                },
                headers: this.headers,
                jar: cookieJar,
                withCredentials: true
            }
        )
    }

    get_anime_details(id) {
        return axios.get(
            'https://anilist.co/api/anime/' + id,
            {
                headers: this.headers,
                jar: cookieJar,
                withCredentials: true
            }
        )
    }

    search_anime(search) {
        return axios.get(
            'https://anilist.co/api/anime/search/' + search,
            {
                headers: this.headers,
                jar: cookieJar,
                withCredentials: true
            }
        )
    }
}

exports.default = Anilist;
