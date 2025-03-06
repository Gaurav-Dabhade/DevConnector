// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Spinner from '../layout/Spinner';
// import { getGithubRepos } from '../../features/profileSlice';

// const ProfileGithub = ({ username }) => {
//   const dispatch = useDispatch();
//   const { repos, loading } = useSelector((state) => state.profile);
//   const [requestSent, setRequestSent] = useState(false);

//   useEffect(() => {
//     if (!requestSent) {
//       dispatch(getGithubRepos(username));
//       setRequestSent(true);
//     }
//   }, [dispatch, username, requestSent]);

//   if (loading) return <Spinner />;

//   return (
//     <div className='profile-github'>
//       <h2 className='text-primary my-1'>
//         <i className='fab fa-github'></i> GitHub Repos
//       </h2>
//       {repos.length === 0 ? (
//         <h4>No GitHub repositories found</h4>
//       ) : (
//         repos.map((repo) => (
//           <div key={repo.id} className='repo bg-white p-1 my-1'>
//             <div>
//               <h4>
//                 <a
//                   href={repo.html_url}
//                   target='_blank'
//                   rel='noopener noreferrer'
//                 >
//                   {repo.name}
//                 </a>
//               </h4>
//               <p>{repo.description}</p>
//             </div>
//             <div>
//               <ul>
//                 <li className='badge badge-primary'>
//                   Stars: {repo.stargazers_count}
//                 </li>
//                 <li className='badge badge-dark'>
//                   Watchers: {repo.watchers_count}
//                 </li>
//                 <li className='badge badge-light'>Forks: {repo.forks_count}</li>
//               </ul>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ProfileGithub;
