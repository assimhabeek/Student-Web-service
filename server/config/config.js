const config = {
    env: 'test-e2e',
    databaseUrl: {
        'test': 'mongodb://localhost:27017/school-test',
        'test-e2e': 'mongodb://localhost:27017/school-test-e2e',
        'prod': 'mongodb://localhost:27017/school'
    },

    // when encripting password of users 
    saltRounds: 10,
    apiKey: 'SDAF$#$#FOKSDFK$HKF:GFLsd564'

}


export default config;