import { Fragment } from 'react'
import {Admin, Resource, AppBar, Layout} from 'react-admin'
import { WorkassignmentList } from './components/WorkassignmentList'
import { WorkassignmentEdit } from './components/WorkassignmentEdit'
import { authProvider } from './providers/authProvider'
import { dataProvider } from './providers/dataProvider'
import { i18nProvider } from './providers/i18nProvider'

const CustomAppBar = props => {
  return <AppBar {...props} container={Fragment} />
}

const CustomLayout = props => {
  return <Layout {...props} appBar={CustomAppBar} />
}

const App = () => (
    <Admin
      authProvider={authProvider('http://cbxcrm.local')}
      dataProvider={dataProvider('http://cbxcrm.local')}
      i18nProvider={i18nProvider}
      layout={CustomLayout}
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