import React from 'react';
import { Admin, Resource } from 'react-admin';
import i18nProvider from '../component/i18n/i18nProvider';
import { cbListGuesser } from '../component/corebosGuessers/cbListGuesser';
import { cbShowGuesser } from '../component/corebosGuessers/cbShowGuesser';
import { cbShowTabGuesser } from '../component/corebosGuessers/cbShowTabGuesser';
import { cbEditGuesser } from '../component/corebosGuessers/cbEditGuesser';
import { cbEditTabGuesser } from '../component/corebosGuessers/cbEditTabGuesser';
import { cbCreateGuesser } from '../component/corebosGuessers/cbCreateGuesser';
import { cbCreateTabGuesser } from '../component/corebosGuessers/cbCreateTabGuesser';
import { cbProject } from '../component/cbProject/cbProject';
import dataProvider from 'react-admin-corebos';
import authProvider from '../component/authProvider/authProvider';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ContactsIcon from '@material-ui/icons/Contacts';
import PlayForWorkIcon from '@material-ui/icons/PlayForWork';
import Dashboard from './dashboard/Dashboard';

const App = () => {
	return (
		<Admin dashboard={Dashboard} dataProvider={dataProvider} authProvider={authProvider} i18nProvider={i18nProvider} >
			{permissions => [
			<Resource
				name="WorkAssignment"
				list={window.coreBOS.Describe.Accounts && window.coreBOS.Describe.Accounts.retrieveable ? cbListGuesser : null}
				show={window.coreBOS.Describe.Accounts && window.coreBOS.Describe.Accounts.retrieveable ? cbShowTabGuesser : null}
				create={window.coreBOS.Describe.Accounts && window.coreBOS.Describe.Accounts.createable ? cbCreateTabGuesser : null}
				edit={window.coreBOS.Describe.Accounts && window.coreBOS.Describe.Accounts.updateable ? cbEditTabGuesser : null}
				icon={AccountBalanceIcon}
			/>,
			]
		}
		</Admin>
	)
}

export default App;