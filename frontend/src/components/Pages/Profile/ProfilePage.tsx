import React from 'react';
import AppTitle from '../../global/AppTitle';
import SideMenu from '../../global/SideMenu';
import { getMenuItemsForPage } from '../../global/sideMenuConfig';
import './ProfilePage.css';
import UserRoles from './components/ActiveRoles';

const ProfilePage: React.FC = () => {
  const menuItems = getMenuItemsForPage("home");
  
  const handleItemClick = (item: string) => {
    console.log("Clicked:", item);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="side-menu-container">
          <SideMenu items={menuItems} onItemClick={handleItemClick} />
        </div>
        <div className="content-container">
          <AppTitle text="PROFILE NAME" />
          <div className="headerOuter">
            <div className="headerInner">
              <div className="userPart">
                <p>Atilla Emre Söylemez</p>
                <p>Bio: I am a CS Student....</p>
              </div>
              <div className="numericPart">
                <p>Total Reviews: 210</p>
                <p>Conferences Worked: 3</p>
                <p>Submissions: 1 View</p>
              </div>
            </div>
            <div className="contactContainer">
              <p className="contact">Contact: emre.soylemez@bilkent.edu.tr</p>
            </div>
          </div> 
          <div className="bottomContainer">
            <div className="roleContainer">
              {/* UserRoles component already includes both sections with their titles */}
              <UserRoles
                activeRoles={[
                  { name: "RECOMB2023, PC Member(TRACK1), Track Chair (YTTW2)" },
                  { name: "CS FAIR, Superchair" }
                ]}
                pastRoles={[
                  { name: "RECOMB2022, PC Member(TRACK1), Track Chair (TRACK2)" }
                ]}
              />
            </div>
            <div className="statsContainer">
              <p className='bottomContainerText'>Stats</p>
              <div className="statsTexts">
                <div className="statsText">
                  <table>
                    <tbody>
                      <tr><td>Average fala filan</td><td>Average fala filan</td></tr>
                      <tr><td>Average fala filan</td><td>Average fala filan</td></tr>
                      <tr><td>Average fala filan</td><td>Average fala filan</td></tr>
                      <tr><td>Average fala filan</td><td>Average fala filan</td></tr>
                      <tr><td>Average fala filan</td><td>Average fala filan</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;