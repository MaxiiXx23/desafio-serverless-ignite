import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamobdConnection";


interface ITodo {
    id: string;
    user_id: string;
    title: string;
    done: string;
    deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {

    const { userid } = event.pathParameters;

    const response = await document
        .scan({
            TableName: 'todos_user',
            FilterExpression: "user_id = :userid",
            ExpressionAttributeValues: {
                ':userid': userid,
            },
        })
        .promise();


    if (response.Items.length <= 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Todos not found!"
            })
        }
    }

    const todosUser = response.Items as ITodo[];

    return {
        statusCode: 200,
        body: JSON.stringify(todosUser)
    }
}