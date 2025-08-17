const config = {
    unit: 'Hiw',
    apiServer: process.env.NODE_ENV === 'production' ? 'https://pop-api.kiznick.me/' : 'http://localhost:3000/',
    second: 5,
    maxClickPerSecond: 500,
}

export default config