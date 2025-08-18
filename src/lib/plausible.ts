import Plausible from 'plausible-tracker'

const plausible = Plausible({
    domain: 'pophiw.kiznick.me',
    trackLocalhost: false,
    apiHost: 'https://plausible.kiznick.me',
    hashMode: true
})

export default plausible