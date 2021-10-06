import React from 'react'
import { IconSettings } from '@salesforce/design-system-react'
import { useListContext } from 'ra-core'
import WATimelineItem from './WATimelineItem'

const Timeline = () => {
    const { data } = useListContext()
    const renderedItems = []
	
	for (let key in data) {
		renderedItems.push(
			<WATimelineItem
				item={data[key]}
				key={key}
			/>
		)
	}

	return (
		<IconSettings iconPath="/icons">
			<ul className="slds-timeline">
				{renderedItems}
			</ul>
		</IconSettings>
	)
}

export default Timeline