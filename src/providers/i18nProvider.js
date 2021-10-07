import dutchMessages from "ra-language-dutch"
import polyglotI18nProvider from 'ra-i18n-polyglot'

const customMessages = {
	'resources.WorkAssignment.name': 'Werkopdrachten',
	'resources.WorkAssignment.fields.workassignment_no': 'Opdrachtnummer',
	'resources.WorkAssignment.fields.workassignmentname': 'Opdrachttitel',
	'resources.WorkAssignment.fields.startdate': 'Begint op',
	'resources.WorkAssignment.fields.enddate': 'Eindigt op',
	'resources.WorkAssignment.fields.account_id': 'Klant',
	'resources.WorkAssignment.fields.wastatus': 'Werkplaats status',
	'Preparation successfully cancelled': 'Voorbereiding van de werkbon geannuleerd'
}

const stockProvider = polyglotI18nProvider(locale => dutchMessages)

export const i18nProvider = {
	translate: (key, options) => {
		if (key.slice(0,3) === 'ra.') {
			return stockProvider.translate(key, options)
		} else {
			return customMessages[key]
		}
	},
	changeLocale: Promise.resolve(),
	getLocale: () => 'nl'
}