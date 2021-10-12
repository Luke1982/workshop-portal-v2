import React, { useState, useEffect } from 'react'
import { useNotify, useDataProvider } from 'ra-core'

const SerialNumberEntry = ({record, product, account, assets, myIterationOnLine}) => {
	const notify = useNotify()
	const dataProvider = useDataProvider()
	const [asset, setAsset] = useState({
		serial: '',
		buildyear: '',
		present: false
	})

	useEffect(() => {
		if (assets[myIterationOnLine] !== undefined) {
			setAsset({
				serial: assets[myIterationOnLine].serialnumber,
				buildyear: assets[myIterationOnLine].cf_903,
				present: true
			})
		}
	}, [assets, myIterationOnLine])

	const saveSerial = async (event) => {
		const button = event.target
		const column = button.parentElement.previousSibling
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
		byInput.disabled = true
		await dataProvider.relate(
			record.id,
			[assetResponse.data.id]
		)
		notify('msg.serial_saved', 'success')
	}

	const updateAssetState = (prop, val) => {
		const newProp = {}
		newProp[prop] = val
		setAsset(Object.assign({}, asset, newProp))
	}

	return (
		<>
			<div className="slds-form-element slds-size_8-of-12 slds-m-bottom_xx-small">
				<div className="slds-grid">
					<div className="slds-col slds-size_8-of-12">
						{myIterationOnLine === 0 &&
							<label className="slds-form-element__label" htmlFor={`serial-${record.id}`}>Serienummer</label>
						}
						<div className="slds-form-element__control">
							{/* TO-DO: check if there isn't already an asset/serial for this input and disable if so */}
							<input
								type="text"
								id={`serial-${record.id}`}
								placeholder="Voer het serienummer in"
								className="slds-input" 
								disabled={asset.present}
								value={asset.serial}
								onChange={e => {updateAssetState('serial', e.target.value)}}
							/>
						</div>
					</div>
					<div className="slds-col slds-size_4-of-12 slds-m-left_xx-small">
						{myIterationOnLine === 0 &&
							<label className="slds-form-element__label" htmlFor={`buildyear-${record.id}`}>Bouwjaar</label>
						}
						<div className="slds-form-element__control">
							{/* TO-DO: check if there isn't already an asset/serial for this input and disable if so */}
							<input
								type="text"
								id={`buildyear-${record.id}`}
								placeholder="Voer het bouwjaar in"
								className="slds-input"
								disabled={asset.present}
								value={asset.buildyear}
								onChange={e => {updateAssetState('buildyear', e.target.value)}}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="slds-size_4-of-12">
				{/* TO-DO: check if there isn't already an asset/serial for this input and disable if so */}
				<button
					className={`slds-button slds-button_brand${myIterationOnLine === 0 ? ' slds-m-top_large' : ''} slds-m-left_small`}
					onClick={(e) => {saveSerial(e)}}
					disabled={asset.present}
				>
						Serienummer opslaan
				</button>
			</div>
		</>
	)
}

export default SerialNumberEntry