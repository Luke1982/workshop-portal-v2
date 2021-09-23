import {Admin, Resource} from 'react-admin'
import { WorkassignmentList } from './components/WorkassignmentList'
import { WorkassignmentEdit } from './components/WorkassignmentEdit'
import { authProvider } from './providers/authProvider'
import { dataProvider } from './providers/dataProvider'
import { i18nProvider } from './providers/i18nProvider'


const App = () => (
    <Admin
      authProvider={authProvider('http://cbdevelop.local')}
      dataProvider={dataProvider('http://cbdevelop.local')}
      i18nProvider={i18nProvider}
    >
      <Resource
        name="WorkAssignment"
        list={WorkassignmentList}
        edit={WorkassignmentEdit}
      />
      <Resource name="Users" />
      <Resource name="Contacts"></Resource>
      <Resource name="Accounts"></Resource>
      <Resource name="SalesOrder"></Resource>
    </Admin>
)

export default App