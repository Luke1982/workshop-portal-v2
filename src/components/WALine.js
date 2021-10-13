import React from 'react'
import { useEffect, useState } from 'react'
import { useDataProvider, useNotify } from 'ra-core'

import WALProductLine from './WALProductLine'

const WALine = ({record, products, account}) => {
	const dataProvider = useDataProvider()
	const notify = useNotify()
	const [productsLoaded, setProductsLoaded] = useState(false)
	const [mainProduct, setMainProduct] = useState(false)
	const [assets, setAssets] = useState(false)
	const [status, setStatus] = useState(false)
	const [parts, setParts] = useState(false)
	const [partsQtyMap, setPartsQtyMap] = useState()
	const [renderedParts, setRenderedParts] = useState()
	const [requiredAssetQty, setRequiredAssetQty] = useState(0)

	useEffect(() => {
		if (!!products) {
			setProductsLoaded(true)
			const foundProduct = products.find(p => p.id === record.product)
			setMainProduct(foundProduct)
		}
	}, [products, record.product])

	useEffect(() => {
		setStatus(record.workshopstatus === 'Ready for delivery')
	}, [record.workshopstatus])

	useEffect(() => {
		if (mainProduct.registable === '1') {
			setRequiredAssetQty(Number(record.qty))
		}
	}, [mainProduct.registable, record.qty])

	useEffect(() => {
		if (productsLoaded === true) {
			const getAssets = async () => {
				const retrievedAssets = await dataProvider.getRelated('WorkAssignmentLines', {
					id: record.id,
					target: 'Assets'
				})
				setAssets(retrievedAssets.data.result.records)
			}
			getAssets()

			const getComponents = async () => {
				const retrievedComponents = await dataProvider.getManyReference('ProductComponent', {
					target: 'frompdo',
					id: mainProduct.id,
					sort: {
						field: 'createdtime',
						order: 'ASC'
					}
				})
				if (retrievedComponents.data.length === 0) {
					return
				}
				const partsQtyMap = {}
				const partIds = retrievedComponents.data.map(c => {
					partsQtyMap[c.topdo] = c.quantity
					return c.topdo
				})
				const retrievedParts = await dataProvider.getMany('Products', {
					ids: partIds
				})
				const partThatNeedAssetsQtys = retrievedParts.data.map(part => {
					if (part.registable === '1') {
						return Number(partsQtyMap[part.id])
					}
				})
				const totalAssetsNeededForParts = partThatNeedAssetsQtys.reduce((a, b) => a + b)
				setRequiredAssetQty((q) => q + totalAssetsNeededForParts)
				setPartsQtyMap(partsQtyMap)
				setParts(retrievedParts.data)
			}
			getComponents()
		}
	}, [productsLoaded, dataProvider, mainProduct.vendor_id, record.id, mainProduct.id])

	useEffect(() => {
		if (parts.length > 0) {
			const tempRenderedParts = parts.map((p, i) => {
				return <WALProductLine
					product={p}
					walLine={record}
					assets={assets}
					type="sub"
					qty={partsQtyMap[p.id]}
					account={account}
					pushToAssets={pushToAssets}
					isFirst={i === 0}
					key={p.id}
				/>
			})
			setRenderedParts(tempRenderedParts)
		}
	}, [parts, partsQtyMap, account, assets, record])

	const markReady = async (id, button) => {
		if (mainProduct.registable === '1' && assets.length < requiredAssetQty) {
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

	const pushToAssets = asset => {
		if (!assets) {
			setAssets([asset])
			return
		}
		assets.push(asset)
		setAssets([...assets])
	}

	return (
		<div className="slds-box slds-theme_shade slds-m-bottom_small">
			<div className="slds-grid">
				<div className="slds-col">
					<div className="slds-text-heading_medium">{mainProduct.productname}</div>
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
			{mainProduct !== false &&
				<WALProductLine
					product={mainProduct}
					walLine={record}
					assets={assets}
					type="main"
					qty={record.qty}
					account={account}
					pushToAssets={pushToAssets}
					isFirst={true}
				/>
			}
			{renderedParts !== undefined &&
				<div className="slds-text-heading_small">Onderdelen</div>
			}
			{renderedParts}
			<div className="slds-grid slds-m-top_x-small">
				<div className="slds-col slds-size_1-of-1">
					<div className="slds-text-title">Opmerkingen</div>
					<div className="slds-text-body_regular">{record.description}</div>
				</div>
			</div>
		</div>
	)
}

export default WALine