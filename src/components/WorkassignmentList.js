import { ListBase } from 'react-admin'
import Timeline from './Timeline'
import LoadUserInfo from './LoadUserInfo'

export const WorkassignmentList = props => {
    return (
        <ListBase {...props} sort={{ field: 'workshop_startdate', 'order': 'ASC'}}>
            <LoadUserInfo />
            <Timeline />
        </ListBase>
    )
}