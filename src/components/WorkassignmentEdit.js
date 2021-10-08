import React from 'react'
import WorkAssignmentContent from './WorkassignmentContent';
import {
	Edit,
	FormWithRedirect,
} from 'react-admin';

const PostTitle = ({record}) => {
	return <span>Werkbon {record.workassignmentname}</span>
}

const WorkassignmentEdit = props => {
	return(
		<Edit component="div" title={<PostTitle />} {...props}>
			<FormWithRedirect
			{...props}
			render={formProps => {
				return (
					<WorkAssignmentContent record={formProps.record} />
				)
			}}/>
		</Edit>
	)
}

export {
	WorkassignmentEdit
}