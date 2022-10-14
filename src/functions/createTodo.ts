import { APIGatewayProxyHandler } from "aws-lambda";
import {v4 as uuidV4} from "uuid";
import { document } from "src/utils/dynamobdConnection";


interface IRequest {
    title: string;
    deadline: string;
}

interface ITodo {
    id: string;
    user_id: string;
    title: string;
    done: string;
    deadline: string;
}


export const handler: APIGatewayProxyHandler = async (event) => {

    const { userid } = event.pathParameters;
    const { title, deadline }: IRequest = JSON.parse(event.body);
    const id = uuidV4();

    await document.put({
        TableName: "todos_user",
        Item: {
            id,
            user_id: userid,
            title,
            done: false,
            deadline: new Date(deadline).getTime()
        }
    }).promise();

    const response = await document.query({
        TableName: "todos_user",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    }).promise();

    const todo = response.Items[0] as ITodo;


    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Todo created with successful!",
            todo
        })
    }
}