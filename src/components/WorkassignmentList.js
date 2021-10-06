import { ListBase } from 'react-admin'
import Timeline from './Timeline'


export const WorkassignmentList = props => {
    return (
        <ListBase {...props} sort={{ field: 'workshop_startdate', 'order': 'ASC'}}>
            <Timeline />
        </ListBase>
    )
}