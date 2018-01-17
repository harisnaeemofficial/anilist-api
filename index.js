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
    get_season_releases() {
        console.log(this.headers)
        return axios.get(
            'https://anilist.co/api/browse/anime',
            {
                params: {
                    'sort'  : 'popularity-desc',
                    'year'  : '2017',
                    'status': 'Currently Airing',
                    'season': 'Fall',
                    'airing_data': 'true'
                },
                headers: this.headers,
                jar: cookieJar,
                withCredentials: true
            }
        )
    }
}