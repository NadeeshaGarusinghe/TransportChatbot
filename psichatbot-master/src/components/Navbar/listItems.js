import React from 'react';
import {Link} from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PhoneIcon from '@material-ui/icons/Phone';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import DashboardIcon from '@material-ui/icons/Dashboard';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
// import PeopleIcon from '@material-ui/icons/People';
// import BarChartIcon from '@material-ui/icons/BarChart';
// import LayersIcon from '@material-ui/icons/Layers';
// import AssignmentIcon from '@material-ui/icons/Assignment';

const linkStyle ={
    textDecoration : 'none',
    color: 'black'
}

export const mainListItems = (
  <div>
    <Link style={linkStyle} to="/home">
        <ListItem button>
        <ListItemIcon>
            <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
        </ListItem>
    </Link>  
    <Link style={linkStyle} to="/bankingchatbot">
        <ListItem button>
        <ListItemIcon>
            <AccountBalanceIcon />
        </ListItemIcon>
        <ListItemText primary="Banking Service Chatbot" />
        </ListItem>
    </Link>
    <Link style={linkStyle} to="/medicalchatbot">
        <ListItem button>
        <ListItemIcon>
            <LocalHospitalIcon />
        </ListItemIcon>
        <ListItemText primary="Medical Service Chatbot" />
        </ListItem>
    </Link>
    <Link style={linkStyle} to="/telecomchatbot">
        <ListItem button>
        <ListItemIcon>
            <PhoneIcon />
        </ListItemIcon>
        <ListItemText primary="Telecommunication Service Chatbot" />
        </ListItem>
    </Link>
    <Link style={linkStyle} to="/transportchatbot">
        <ListItem button>
        <ListItemIcon>
            <DirectionsBusIcon />
        </ListItemIcon>
        <ListItemText primary="Transportation Service Chatbot" />
        </ListItem>
    </Link>
  </div>
);

export const secondaryListItems = (
  <div>
    {/* <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem> */}
  </div>
);

