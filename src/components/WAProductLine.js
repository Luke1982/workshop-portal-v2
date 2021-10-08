import React from 'react'
import { useEffect, useState } from 'react'
import { useDataProvider, useNotify } from 'ra-core'

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
	}, [productsLoaded, dataProvider, product.vendor_id])

	const markReady = id => {
		console.log(id)
	}

	const saveSerial = async (event) => {
		const button = event.target
		const column = button.parentElement.parentElement
		const snInput = column.getElementsByTagName('input')[0]
		const byInput = column.getElementsByTagName('input')[1]
		const serialnumber = snInput.value
		if (serialnumber === '') {
			notify('msg.no_empty_serial', 'warning')
			return
		}
		if (!/^[0-9]{4}$/.test(byInput.value) || byInput.value.toString() === '') {
			notify('msg.buildyear_wrong', 'warning')
			return
		}
		button.disabled = true
		const newAsset = {
			account,
			serialnumber,
			assetname: 'Tijdelijke naam',
			product: product.id,
			dateinservice: '01-01-1900',
			assigned_user_id: localStorage.getItem('cbuserid'),
			assetstatus: 'In Gebruik',
			cf_903: byInput.value
		}
		const assetResponse = await dataProvider.create('Assets', newAsset)
		snInput.disabled = true
		await dataProvider.relate(
			record.id,
			[assetResponse.data.id]
		)
		notify('msg.serial_saved', 'success')
	}

	return (
		<div className="slds-box slds-theme_shade slds-m-bottom_small">
			<div className="slds-grid">
				<div className="slds-col">
					<div className="slds-text-heading_medium">{product.productname}</div>
				</div>
				<div className="slds-col">
					<button className="slds-button slds-button_success slds-float_right" onClick={() => {markReady(record.id)}}>Klaar</button>
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
				<div className="slds-col slds-size_4-of-12 slds-grid">
					<div className="slds-form-element slds-size_8-of-12">
						<div className="slds-grid">
							<div className="slds-col slds-size_8-of-12">
								<label className="slds-form-element__label" htmlFor={`serial-${record.id}`}>Serienummer</label>
								<div className="slds-form-element__control">
									{/* TO-DO: check if there isn't already an asset/serial for this input and disable if so */}
									<input type="text" id={`serial-${record.id}`} placeholder="Voer het serienummer in" className="slds-input" />
								</div>
							</div>
							<div className="slds-col slds-size_4-of-12 slds-m-left_xx-small">
								<label className="slds-form-element__label" htmlFor={`buildyear-${record.id}`}>Bouwjaar</label>
								<div className="slds-form-element__control">
									{/* TO-DO: check if there isn't already an asset/serial for this input and disable if so */}
									<input
										type="text"
										id={`buildyear-${record.id}`}
										placeholder="Voer het bouwjaar in"
										className="slds-input"
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="slds-size_4-of-12">
						{/* TO-DO: check if there isn't already an asset/serial for this input and disable if so */}
						<button
							className="slds-button slds-button_brand slds-m-top_large slds-m-left_small"
							onClick={(e) => {saveSerial(e)}}>Serienummer opslaan</button>
					</div>
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