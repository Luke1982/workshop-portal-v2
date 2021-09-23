import React from 'react'
import {
	Edit,
	FormWithRedirect,
	TextField,
	SaveButton,
	TopToolbar,
} from 'react-admin';
import {
	Button,
	ButtonGroup,
	Grid,
	Box
} from '@material-ui/core'

const setStatus = (status) => {
	console.log(status)
}

const EditActions = ({basePath, data, resource}) => {
	return (
		<TopToolbar>
			<ButtonGroup>
				<Button
					color='primary'
					variant="outlined"
					onClick={() => setStatus('in_preparation')}>
						Ik ga deze voorbereiden
				</Button>
				<SaveButton
					basePath={basePath}
					record={data}
					variant='contained'
					color='primary'
				/>
			</ButtonGroup>
		</TopToolbar>
	)
}

const WorkassignmentEditForm = props => {
	return (
		<FormWithRedirect
			{...props}
			render={formProps => {
				console.log(formProps)
				return (
					<form>
						<Box p="1rem">
							<Box display="flex">
								<Box flex={2} mr="1em">
									<TextField addLabel={true} source="workassignment_no" />
								</Box>
							</Box>
						</Box>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<TextField source="workassignment_no" resource="workassignment" />
							</Grid>
							<Grid item xs={6}>
								<TextField source="wastatus" />
							</Grid>
							<Grid item xs={6}>
								<TextField source="workassignmentname" />
							</Grid>
						</Grid>
					</form>
				)
			}}/>
	)
}

const WorkassignmentEdit = props => {
	return(
		<Edit {...props} actions={<EditActions />}>
			<WorkassignmentEditForm />
		</Edit>
	)
}

export {
	WorkassignmentEdit
}