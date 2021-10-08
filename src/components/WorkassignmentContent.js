import React, {useRef, useState, useEffect} from 'react'
import {Spinner} from '@salesforce/design-system-react'
import WAProductLine from './WAProductLine'
import { useDataProvider } from 'ra-core'

const WorkAssignmentContent = ({record}) => {
	const dataProvider = useDataProvider()
	const topbarRef = useRef()
	const [lines, setLines] = useState(false)
	const [products, setProducts] = useState(false)
	const [productIds, setProductIds] = useState(false)
	const [productsLoaded, setProductsLoaded] = useState(false)
	const [renderedLines, setRenderedLines] = useState([<Spinner
		key="spinner"
		variant="brand"
		containerClassName="slds-is-relative slds-p-vertical_large"
		/>]
	)

	window.addEventListener('scroll', () => {
		requestAnimationFrame(() => {
			if (topbarRef.current !== undefined) {
				topbarRef.current.style.transform = `translateY(${window.scrollY}px)`
			}
		})
	})

	useEffect(() => {
		const getLines = async () => {
			const result = await dataProvider.getManyReference(
				'WorkAssignmentLines', {
					target: 'workassignment',
					id: record.id,
					sort: {
						field: 'seq',
						order: 'ASC'
					}
				}
			)
			setLines(result.data)
		}
		getLines()
	}, [dataProvider, record.id])

	useEffect(() => {
		if (!!lines && !products) {
			const collectedProductIds = []
			const renderedLines = lines.map(line => {
				collectedProductIds.push(line.product)
				return <WAProductLine record={line} key={line.id} products={products} account={record.account_id} />
			})
			setProductIds(collectedProductIds)
			setRenderedLines(renderedLines)
		} else if (productsLoaded === true) {
			const renderedLines = lines.map(line => {
				return <WAProductLine record={line} key={line.id} products={products} account={record.account_id} />
			})
			setRenderedLines(renderedLines)
		}
	}, [lines, products, productsLoaded, record.account_id])

	useEffect(() => {
		if (!!productIds) {
			const getProducts = async () => {
				if (productIds.length > 0) {
					const result = await dataProvider.getMany('Products', {ids: productIds})
					setProducts(result.data)
					setProductsLoaded(true)
				}
			}
			getProducts()
		}
	}, [productIds, dataProvider])

	return (
		<>
			<div className="slds-grid slds-box slds-theme_shade slds-theme_alert-texture" ref={topbarRef}>
				<div className="slds-col">
					<b>Werbon nummer:</b> {record.workassignment_no}
				</div>
				<div className="slds-col">
					<b>Ordernummer:</b>
				</div>
				<div className="slds-col">
					<b>Klant:</b>
				</div>
				<div className="slds-col">
					<b>Uiterlijk klaar op:</b>
				</div>
			</div>
			<div className="slds-box slds-m-top_small">
				{renderedLines}
			</div>
		</>
	)
}

export default WorkAssignmentContent