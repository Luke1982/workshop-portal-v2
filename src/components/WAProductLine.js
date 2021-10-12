import React from 'react'
import { useEffect, useState } from 'react'
import { useDataProvider, useNotify } from 'ra-core'
import SerialNumberEntry from './SerialNumberEntry'

const WAProductLine = ({record, products, account}) => {
	const dataProvider = useDataProvider()
	const notify = useNotify()
	const [productsLoaded, setProductsLoaded] = useState(false)
	const [product, setProduct] = useState({
		productname: 'Laden...',
		product_no: 'Laden...',
		vendor_part_no: 'Laden...',
		cf_940: 'Laden...'
	})
	const [vendor, setVendor] = useState({
		vendorname: 'Niet bekend'
	})
	const [assets, setAssets] = useState(false)
	const [qty, setQty] = useState(0)
	const [renderedSerialInputs, setRenderedSerialInputs] = useState([])
	const [status, setStatus] = useState(false)

	useEffect(() => {
		setStatus(record.workshopstatus === 'Ready for delivery')
	}, [record.workshopstatus])

	useEffect(() => {
		if (record.qty !== undefined) {
			setQty(Number(record.qty))
		}
	}, [record])

	useEffect(() => {
		if (product.registable === '1') {
			const newSerialInputs = []
			for (let i = 0; i < qty; i++) {
				newSerialInputs.push(
					<SerialNumberEntry
						record={record}
						product={product}
						account={account}
						key={`asset-${record.id}-${i}`}
						assets={assets}
						myIterationOnLine={i}
					/>
				)
			}
			setRenderedSerialInputs(newSerialInputs)
		}
	}, [qty, record, product, account, assets])

	useEffect(() => {
		if (!!products) {
			setProductsLoaded(true)
			const foundProduct = products.find(p => p.id === record.product)
			setProduct(foundProduct)
		}
	}, [products, record.product])

	useEffect(() => {
		if (productsLoaded === true && product.vendor_id !== '') {
			const getVendor = async () => {
				const retrievedVendor = await dataProvider.getOne('Vendors', {id: product.vendor_id})
				setVendor(retrievedVendor.data)
			}
			getVendor()
		}
		if (productsLoaded === true) {
			const getAssets = async () => {
				const retrievedAssets = await dataProvider.getRelated('WorkAssignmentLines', {
					id: record.id,
					target: 'Assets'
				})
				setAssets(retrievedAssets.data.result.records)
			}
			getAssets()
		}
	}, [productsLoaded, dataProvider, product.vendor_id, record.id])

	const markReady = async (id, button) => {
		if (product.registable === '1' && assets.length < qty) {
			notify('msg.cannot_close_wal_not_all_serials', 'error')
			return
		}
		button.disabled = true
		const response = await dataProvider.update('WorkAssignmentLines', {
			id: record.id,
			workshopstatus: 'Ready for delivery'
		})
		if (response.data.workshopstatus === 'Ready for delivery') {
			notify('msg.closing_wal_succeeded', 'success')
			setStatus(true)
		}

	}

	return (
		<div className="slds-box slds-theme_shade slds-m-bottom_small">
			<div className="slds-grid">
				<div className="slds-col">
					<div className="slds-text-heading_medium">{product.productname}</div>
				</div>
				<div className="slds-col">
					<button
						className="slds-float_right slds-button slds-button_success slds-float_right slds-m-left_xx-small"
						onClick={(e) => {markReady(record.id, e.target)}}
						disabled={status}
					>
						Klaar
					</button>
					{status &&
						<span className="slds-float_right slds-icon_container slds-icon-action-approval slds-icon_container_circle">
							<svg className="slds-icon slds-icon_xx-small">
								<use xlinkHref="/icons/action-sprite/svg/symbols.svg#approval"></use>
							</svg>
						</span>
					}
				</div>
			</div>
			<div className="slds-grid">
				<div className="slds-col slds-size_8-of-12">
					<div className="slds-grid">
						<div className="slds-col slds-size_1-of-5">
							<div className="slds-text-title">Productnummer</div>
							<div className="slds-text-body_regular">{product.product_no}</div>
						</div>
						<div className="slds-col slds-size_1-of-5">
							<div className="slds-text-title">Artikelnummer</div>
							<div className="slds-text-body_regular">{product.vendor_part_no}</div>
						</div>
						<div className="slds-col slds-size_1-of-5">
							<div className="slds-text-title">Leverancier</div>
							<div className="slds-text-body_regular">{vendor.vendorname}</div>
						</div>
						<div className="slds-col slds-size_1-of-5">
							<div className="slds-text-title">Locatie</div>
							<div className="slds-text-body_regular">{product.cf_940}</div>
						</div>
						<div className="slds-col slds-size_1-of-5">
							<div className="slds-text-title">Aantal</div>
							<div className="slds-text-body_regular">{record.qty}</div>
						</div>
					</div>
				</div>
				<div className="slds-col slds-size_4-of-12 slds-grid slds-wrap">
					{renderedSerialInputs}
				</div>
			</div>
			<div className="slds-grid slds-m-top_x-small">
				<div className="slds-col slds-size_1-of-1">
					<div className="slds-text-title">Opmerkingen</div>
					<div className="slds-text-body_regular">{record.description}</div>
				</div>
			</div>
		</div>
	)
}

export default WAProductLine