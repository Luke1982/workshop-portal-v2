import {
	List,
	Datagrid,
	TextField,
	ReferenceField,
	DateField,
} from 'react-admin'

export const WorkassignmentList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="workassignment_no" />
            <TextField source="workassignmentname" />
            <DateField source="startdate" />
            <DateField source="enddate" />
            <ReferenceField source="account_id" reference="Accounts" link={false}>
                <TextField source="accountname" />
            </ReferenceField>
            <TextField source="wastatus" />
        </Datagrid>
    </List>
);