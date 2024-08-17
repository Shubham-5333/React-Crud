import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAdminLogoutMutation } from '../slices/adminApiSlices';
import { adminLogout } from '../slices/adminAuthSlices';

function AdminHeader() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useAdminLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(adminLogout());
      navigate('/admin/login');
    } catch (err) {
      console.log('Logout error:', err);
    }
  };

  return (
<header>
      <Navbar variant='light' expand='lg' collapseOnSelect style={{ backgroundColor: 'rgba(254, 215, 555, 0.7)' }}>
        <Container>
          <LinkContainer to='/admin/home'>
            <Navbar.Brand>ADMIN DASHBOARD</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )

}

export default AdminHeader;