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
	'Preparation successfully cancelled': 'Voorbereiding van de werkbon geannuleerd',
	'msg.no_empty_serial': 'Serienummer kan niet leeg zijn',
	'msg.serial_saved': 'Serienummer opgeslagen',
	'msg.buildyear_wrong': 'Bouwjaar verkeerd ingevoerd',
	'msg.invalid_date': 'Ongeldige datum, is er wel een datum ingesteld?',
	'msg.cannot_close_wal_not_all_serials': 'Je kunt deze regel niet klaar melden, je hebt nog niet alle serienummers ingevuld',
	'msg.closing_wal_succeeded': 'Gelukt, de regel is klaargezet'
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