import React from 'react';
import FriendData from './friendData'
import { useParams} from 'react-router-dom';

export default function FriendDPage() {
    let { friendname } = useParams();
    return <FriendData friendname = {friendname}/>
}



