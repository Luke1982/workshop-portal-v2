import React, {useState, useEffect} from 'react'
import { useDataProvider, useNotify } from 'ra-core'
import { Link } from 'react-router-dom'

const WATimelineItem = ({ item }) => {
	const dataProvider = useDataProvider()
	const notify = useNotify()
	const [account, setAccount] = useState({
		accountname: 'Laden'
	})
	const [salesorder, setSalesOrder] = useState({
		salesorder_no: 'Laden'
	})

	const formatDate = date => {
		return `
			<b>${date.toLocaleString('nl-NL', {weekday: 'long'})}</b><br />
			${date.getHours() < 10 ? '0' : ''}${date.getHours()}:
			${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()} | 
			${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}
		`
	}

	const startDate = new Date(item.workshop_startdate)
	const endDate = new Date(item.workshop_enddate)
	const now = new Date()
	const formattedStartDate = formatDate(startDate)

	let clockIconColor = (startDate.getDate() === now.getDate() && startDate.getMonth() === now.getMonth()) ? 'custom110' : ''
	if (startDate.getTime() < (now.getTime() - 86400000)) {
		clockIconColor = 'custom53'
	}
	if (startDate.getTime() > (now.getTime() + 86400000)) {
		clockIconColor = 'custom5'
	}

	useEffect(() => {
		const getAccount = async () => {
			const retrievedAccount = await dataProvider.getOne('', {id: item.account_id})
			setAccount(retrievedAccount.data)
		}
		getAccount()

		const getSalesOrder = async () => {
			const retrievedSO = await dataProvider.getOne('', {id: item.salesorder})
			setSalesOrder(retrievedSO.data)
		}
		getSalesOrder()
	}, [dataProvider, item.account_id, item.salesorder])

	const cancelWorkAssignment = async id => {
		try {
			await dataProvider.update(
				'WorkAssignment',
				Object.assign({},item, { 'wastatus': 'Preparation cancelled' })
			)
			notify(`Preparation successfully cancelled`, 'success');
		} catch (e) {
			notify(e, 'warning')
		}
	}

	return (
		<li key={item.id}>
			<div className="slds-timeline__item_expandable slds-timeline__item_service-crew-member slds-is-open">
				<div className="slds-media">
					<div className="slds-media__figure">
						<div className="slds-icon_container slds-icon-standard-service-crew-member slds-timeline-icon slds-m-left_large slds-m-top_small">
							<svg className="slds-icon slds-icon_small">
								<use xlinkHref="/icons/standard-sprite/svg/symbols.svg#service_crew_member"></use>
							</svg>
						</div>
					</div>
					<div className="slds-media__body">
						<div className="slds-grid slds-grid_align-spread slds-timeline__trigger slds-m-top_none">
							<div className="slds-grid slds-grid_vertical-align-center slds-truncate_container_75 slds-no-space">
								<h3 className="slds-truncate">{item.workassignmentname}</h3>
							</div>
							<div className="slds-timeline__actions slds-timeline__actions_inline">
								<p className="slds-timeline__date" dangerouslySetInnerHTML={{__html: formattedStartDate}}></p>
									<span className={`slds-icon_container slds-icon-custom-${clockIconColor}`} title="Description of icon when needed">
									<svg className="slds-icon" aria-hidden="true">
										<use xlinkHref="/icons/custom-sprite/svg/symbols.svg#custom95"></use>
									</svg>
								</span>
							</div>
						</div>
						<article className="slds-box slds-timeline__item_details slds-theme_shade slds-m-top_x-small slds-m-horizontal_xx-small slds-p-around_medium">
							<ul className="slds-list_horizontal slds-wrap">
								<li className="slds-grid slds-grid_vertical slds-size_1-of-2 slds-p-bottom_small">
									<span className="slds-text-title slds-p-bottom_x-small">Werkbon nummer</span>
									<span className="slds-text-body_medium">
										<a href="/WorkAssignment">{item.workassignment_no}</a>
									</span>
								</li>
								<li className="slds-grid slds-grid_vertical slds-size_1-of-2 slds-p-bottom_small">
									<span className="slds-text-title slds-p-bottom_x-small">Order nummer</span>
									<span className="slds-text-body_medium">
										<a href="/WorkAssignment">{salesorder.salesorder_no}</a>
									</span>
								</li>
							</ul>
							<ul className="slds-list_horizontal slds-wrap">
								<li className="slds-grid slds-grid_vertical slds-size_1-of-2 slds-p-bottom_small">
									<span className="slds-text-title slds-p-bottom_x-small">Klant</span>
									<span className="slds-text-body_medium">
										<a href="/WorkAssignment">{account.accountname}</a>
									</span>
								</li>
								<li className="slds-grid slds-grid_vertical slds-size_1-of-2 slds-p-bottom_small">
									<span className="slds-text-title slds-p-bottom_x-small">Uiterlijk klaar op</span>
									<span className="slds-text-body_medium">
										<a href="/WorkAssignment" dangerouslySetInnerHTML={{__html: formatDate(endDate)}}></a>
									</span>
								</li>
							</ul>
							<div className="slds-clearfix">
								<div className="slds-button-group slds-float_right slds-m-top_small">
									<button className="slds-button slds-button_destructive" onClick={() => cancelWorkAssignment(item.id)}>
										<svg className="slds-button__icon slds-button__icon_left" aria-hidden="true">
											<use xlinkHref="/icons/standard-sprite/svg/symbols.svg#date_input"></use>
										</svg>
										Annuleren
									</button>
									<Link to={`/WorkAssignment/${item.id}`}>
										<button className="slds-button slds-button_success">
											<svg className="slds-button__icon slds-button__icon_left" aria-hidden="true">
												<use xlinkHref="/icons/standard-sprite/svg/symbols.svg#service_crew_member"></use>
											</svg>
											Open bon
										</button>
									</Link>
								</div>
							</div>
						</article>
					</div>
				</div>
			</div>
		</li>
	)
}

export default WATimelineItem