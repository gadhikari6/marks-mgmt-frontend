import React, { useEffect, useState } from 'react'

const Profile = () => {
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    // Fetch profile data from the API endpoint
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:9000/api/v1/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(localStorage.getItem('token'))
        const data = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error('Error fetching profile data:', error)
      }
    }

    fetchProfileData()
  }, [])

  return (
    <div className="profile-container">
      {profileData ? (
        <div>
          <h2>Profile Page</h2>
          <p>
            <strong>ID:</strong> {profileData.id}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Name:</strong> {profileData.name}
          </p>
          <p>
            <strong>Address:</strong> {profileData.address}
          </p>
          <p>
            <strong>Contact No:</strong> {profileData.contactNo}
          </p>
          <p>
            <strong>Activated:</strong> {profileData.activated.toString()}
          </p>
          <p>
            <strong>Expired:</strong> {profileData.expired.toString()}
          </p>
          <p>
            <strong>User Roles:</strong>{' '}
            {profileData.UserRoles.map((userRole) => userRole.role.name).join(', ')}
          </p>
          <p>
            <strong>Symbol No:</strong> {profileData.student.symbolNo}
          </p>
          <p>
            <strong>PU Reg No:</strong> {profileData.student.puRegNo}
          </p>
          <p>
            <strong>Semester ID:</strong> {profileData.student.semesterId}
          </p>
          <p>
            <strong>User ID:</strong> {profileData.student.userId}
          </p>
          <p>
            <strong>Program ID:</strong> {profileData.student.programId}
          </p>
          <p>
            <strong>Syllabus ID:</strong> {profileData.student.syllabusId}
          </p>
        </div>
      ) : (
        <p>Loading profile data...</p>
      )}
    </div>
  )
}

export default Profile
