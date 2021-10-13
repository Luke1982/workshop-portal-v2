import React, {useRef, useState, useEffect} from 'react'
import {Spinner} from '@salesforce/design-system-react'
import WALine from './WALine'
import { useDataProvider } from 'ra-core'
import { i18nProvider } from '../providers/i18nProvider'

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
			if (topbarRef.current !== undefined && topbarRef.current !== null) {
				topbarRef.current.style.transform = `translateY(${window.scrollY}px)`
				if (window.scrollY > 0) {
					topbarRef.current.style.boxShadow = `0px 10px 40px -20px rgba(0,0,0,0.75)`
					topbarRef.current.style.marginTop = `-1.2rem`
				} else {
					topbarRef.current.style.boxShadow = `none`
					topbarRef.current.style.marginTop = `0`
				}
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
				return <WALine record={line} key={line.id} products={products} account={record.account_id} />
			})
			setProductIds(collectedProductIds)
			setRenderedLines(renderedLines)
		} else if (productsLoaded === true) {
			const renderedLines = lines.map(line => {
				return <WALine record={line} key={line.id} products={products} account={record.account_id} />
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

	const formatDate = date => {
		if (date.toString() === 'Invalid Date') {
			return i18nProvider.translate('msg.invalid_date')
		}
		return `
			${date.toLocaleString('nl-NL', {weekday: 'long'})}
			${date.getDate() < 10 ? '0' : ''}${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} om
			${date.getHours() < 10 ? '0' : ''}${date.getHours()}:
			${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}
		`
	}

	return (
		<>
			<div 
				className="slds-grid slds-box slds-theme_warning slds-theme_alert-texture"
				ref={topbarRef}
				style={{
					position: 'relative',
					zIndex: 2,
					transition: 'box-shadow 100ms ease, margin 100ms ease'
				}}
			>
				<div
					className="slds-col"
					style={{
						position: 'relative',
						zIndex: 1
					}}
				>
					<b>Werbon nummer:</b> {record.workassignment_no}
				</div>
				<div className="slds-col">
					<b>Ordernummer:</b>
				</div>
				<div className="slds-col">
					<b>Klant:</b> {record.account_idename.reference || 'Onbekend'}
				</div>
				<div
					className="slds-col"
					dangerouslySetInnerHTML={{__html: `<b>Uiterlijk klaar op:</b>${formatDate(new Date(record.workshop_enddate))}`}}>
				</div>
			</div>
			<div className="slds-box slds-m-top_small">
				{renderedLines}
			</div>
		</>
	)
}

export default WorkAssignmentContent