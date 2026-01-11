import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
    console.log("EVENT RAW:", JSON.stringify(event, null, 2));

    // HTTP API v2.0 no necesita manejar OPTIONS manualmente
    // API Gateway lo hace automáticamente con la configuración CORS

    try {
        // Parsear body
        let data;
        if (event.body) {
            data = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        } else {
            data = event;
        }

        console.log("DATA PARSED:", JSON.stringify(data, null, 2));

        if (!data) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Datos requeridos" }),
            };
        }

        console.log("Saving to DynamoDB:", data);

        await docClient.send(
            new PutCommand({
                TableName: "spellscrims-teams",
                Item: data,
            })
        );

        console.log("Successfully saved");

        // En HTTP API v2.0 con CORS configurado, NO necesitas agregar headers manualmente
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Jugador guardado correctamente",
                userId: data.userId
            }),
        };
    } catch (error: any) {
        console.error("ERROR:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error al guardar el equipo",
                error: error.message,
            }),
        };
    }
};
