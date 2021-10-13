import React, {useState, useEffect} from 'react'
import { useDataProvider } from 'ra-core'
import SerialNumberEntry from './SerialNumberEntry'

const WALProductLine = ({product, walLine, assets, type, qty, account, pushToAssets, isFirst}) => {
	const dataProvider = useDataProvider()
	const [renderedSerialInputs, setRenderedSerialInputs] = useState([])
	const [vendor, setVendor] = useState({
		vendorname: 'Niet bekend'
	})

	useEffect(() => {
		if (product.vendor_id !== '') {
			const getVendor = async () => {
				const retrievedVendor = await dataProvider.getOne('Vendors', {id: product.vendor_id})
				setVendor(retrievedVendor.data)
			}
			getVendor()
		}
	}, [product.vendor_id, dataProvider])

	useEffect(() => {
		if (product.registable === '1') {
			const newSerialInputs = []
			for (let i = 0; i < qty; i++) {
				newSerialInputs.push(
					<SerialNumberEntry
						record={walLine}
						product={product}
						account={account}
						key={`asset-${walLine.id}-${i}`}
						assets={assets}
						myIterationOnLine={i}
						pushToAssets={pushToAssets}
						showTitle={!isFirst}
					/>
				)
			}
			setRenderedSerialInputs(newSerialInputs)
		}
	}, [qty, walLine, product, account, assets, pushToAssets, isFirst])

	return (
		<div className="slds-grid">
			<div className="slds-col slds-size_8-of-12">
				<div className="slds-grid">
					<div className="slds-col slds-size_1-of-5">
						{isFirst &&
							<div className="slds-text-title">
								{type === 'sub' && 'Productnaam + nummer'}
								{type === 'main' && 'Productnummer'}
							</div>
						}
						<div className="slds-text-body_regular slds-m-top_xx-small">
							{type === 'sub' && `${product.productname} (${product.product_no})`}
							{type === 'main' && `${product.product_no}`}
						</div>
					</div>
					<div className="slds-col slds-size_1-of-5">
						{isFirst && <div className="slds-text-title">Artikelnummer</div>}
						<div className="slds-text-body_regular slds-m-top_xx-small">{product.vendor_part_no}</div>
					</div>
					<div className="slds-col slds-size_1-of-5">
						{isFirst && <div className="slds-text-title">Leverancier</div>}
						<div className="slds-text-body_regular slds-m-top_xx-small">{vendor.vendorname}</div>
					</div>
					<div className="slds-col slds-size_1-of-5">
						{isFirst && <div className="slds-text-title">Locatie</div>}
						<div className="slds-text-body_regular slds-m-top_xx-small">{product.cf_940}</div>
					</div>
					<div className="slds-col slds-size_1-of-5">
						{isFirst && <div className="slds-text-title">Aantal</div>}
						<div className="slds-text-body_regular slds-m-top_xx-small">{qty}</div>
					</div>
				</div>
			</div>
			<div className="slds-col slds-size_4-of-12 slds-grid slds-wrap">
				{renderedSerialInputs}
			</div>
		</div>
	)
}

export default WALProductLine