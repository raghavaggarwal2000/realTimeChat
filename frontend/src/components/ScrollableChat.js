import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from '../utils/ChatLogic'
import { ChatState } from '../context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({messages}) => {
    const {user} = ChatState();
  return (
    <ScrollableFeed>
        {messages && messages.map((m,i) =>(
            <div key={i} style={{display:"flex"}}>
                {(
                    isSameSender(messages,m, i, user._id)
                    ||
                    isLastMessage(messages, i, user._id) 
                )&&(
                    <Tooltip
                        label = {m.sender.name}
                        placement='bottom-start'
                        hasArrow
                    >
                        <Avatar 
                            size={"sm"}
                            cursor={"pointer"}
                            name={m.sender.name}
                            src = {m.sender.pic}
                        />

                    </Tooltip>
                )}

                <span style={{
                    backgroundColor: `${
                        m.sender._id === user._id? "#B9F5D0" : "#BEE3F8"
                        }`,
                    color: "black",
                    borderRadius:"20px",
                    padding:"5px 15px",
                    maxWidth: "75%",
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}>
                    {m.content}

                </span>
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat