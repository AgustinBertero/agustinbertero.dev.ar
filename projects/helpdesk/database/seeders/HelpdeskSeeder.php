<?php

namespace Database\Seeders;

use App\Models\KnowledgeArticle;
use App\Models\Ticket;
use Illuminate\Database\Seeder;

class HelpdeskSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Restablecer contraseña y recuperar el acceso',
                'tags' => ['cuenta', 'password', 'acceso'],
                'body' => 'Si no podés entrar, usá “Olvidé mi contraseña” en la pantalla de acceso. El enlace vence a los 30 minutos y solo se puede usar una vez. Revisá spam y la carpeta de promociones. Si el email de la cuenta ya no existe, pedí el cambio de email desde el formulario de contacto con un comprobante de identidad. Por seguridad, no compartas contraseñas por chat.',
            ],
            [
                'title' => 'Cobros duplicados y reembolsos',
                'tags' => ['facturación', 'cobro', 'reembolso', 'suscripción'],
                'body' => 'Un cobro duplicado puede ser una autorización temporal de la tarjeta. Si aparece dos veces como “capturado”, enviá el ID de pago y la fecha. Los reembolsos se procesan al mismo medio de pago y pueden tardar entre 5 y 10 días hábiles. No prometas fechas exactas sin verificar el estado en el panel de pagos.',
            ],
            [
                'title' => 'Estados de pedido y entregas',
                'tags' => ['envíos', 'pedido', 'entrega', 'tracking'],
                'body' => 'Los estados son: preparando, despachado, en tránsito, en reparto y entregado. Si el seguimiento figura entregado pero no recibiste el paquete, revisá con el conserje o vecinos y abrí un reclamo con el número de pedido dentro de las 48 horas. El transportista puede pedir una declaración jurada para iniciar la investigación.',
            ],
            [
                'title' => 'Error 500 al guardar formularios',
                'tags' => ['técnico', 'error', '500', 'formulario'],
                'body' => 'Un 500 suele ser un error del servidor, no de los datos. Revisá los logs de la aplicación y el timestamp exacto. Si el error aparece solo con archivos adjuntos, verificá el límite de subida de Nginx y PHP. Para reproducirlo, pedí el navegador, la URL y el ID de la entidad que se estaba guardando.',
            ],
            [
                'title' => 'API: autenticación y límites de uso',
                'tags' => ['api', '429', 'rate limit', 'token'],
                'body' => 'La API usa un token Bearer. El límite por defecto es de 60 requests por minuto por token; al superarlo devuelve 429 con el header Retry-After. No reintentes en bucle: esperá el tiempo indicado y usá backoff exponencial. Para aumentar el límite, el equipo debe revisar el plan y el patrón de consumo.',
            ],
            [
                'title' => 'Exportar datos y eliminar una cuenta',
                'tags' => ['cuenta', 'gdpr', 'datos', 'privacidad'],
                'body' => 'Cualquier persona puede pedir una exportación de sus datos desde Configuración > Privacidad. La exportación incluye perfil, pedidos y mensajes, y se entrega en un archivo JSON. La eliminación es irreversible: se borran los datos personales y se conservan únicamente los registros contables exigidos por ley. Verificá la identidad antes de ejecutar la baja.',
            ],
            [
                'title' => 'Verificación de email y cuentas bloqueadas',
                'tags' => ['cuenta', 'email', 'verificación', 'bloqueo'],
                'body' => 'Las cuentas nuevas deben verificar el email antes de operar. Si el enlace venció, se puede reenviar desde el login. Después de cinco intentos fallidos, la cuenta se bloquea 15 minutos. Un agente puede desbloquearla manualmente desde el panel de administración después de verificar la identidad.',
            ],
            [
                'title' => 'Webhooks: reintentos y firma',
                'tags' => ['api', 'webhook', 'firma', 'reintentos'],
                'body' => 'Los webhooks se firman con HMAC-SHA256 en el header X-Signature. Si el endpoint no responde 2xx en 10 segundos, se reintenta con backoff durante 24 horas. Para depurar, revisá el historial de entregas y el cuerpo exacto; no valides la firma sobre el JSON reformateado.',
            ],
            [
                'title' => 'Facturas y datos fiscales',
                'tags' => ['facturación', 'factura', 'iva', 'empresa'],
                'body' => 'La factura se emite con los datos fiscales cargados al momento del pago. Para corregir un número de IVA o una razón social, enviá la factura original y el dato correcto; la corrección se emite como nota de crédito. No se puede cambiar el titular de una factura ya declarada.',
            ],
            [
                'title' => 'Límites de subida de archivos',
                'tags' => ['técnico', 'archivos', 'límite', 'nginx'],
                'body' => 'El límite por archivo es de 10 MB y el total por formulario es de 25 MB. Si el archivo supera el límite, el servidor puede devolver 413 antes de llegar a la aplicación. Comprimí imágenes o dividí el envío. Los archivos se guardan en almacenamiento privado y se eliminan a los 30 días.',
            ],
        ];

        $articleIds = [];
        foreach ($articles as $article) {
            $created = KnowledgeArticle::create($article);
            $articleIds[$article['title']] = $created->id;
        }

        $tickets = [
            [
                'subject' => 'No puedo entrar después del cambio de contraseña',
                'requester_name' => 'Lucía Fernández',
                'requester_email' => 'lucia.fernandez@example.com',
                'status' => 'open',
                'priority' => 'high',
                'category' => 'account',
                'triage_status' => 'done',
                'summary' => 'La clienta cambió la contraseña y el enlace de recuperación vence antes de poder usarlo. Necesita recuperar el acceso a la cuenta.',
                'suggested_reply' => 'Hola Lucía: el enlace de recuperación vence a los 30 minutos y solo se puede usar una vez. Probá pedir uno nuevo desde “Olvidé mi contraseña” y revisá spam/promociones. Si vuelve a fallar, respondé con el email de la cuenta y el horario exacto del intento para revisar el registro.',
                'citations' => [$articleIds['Restablecer contraseña y recuperar el acceso']],
                'messages' => [
                    ['customer', 'Hola, cambié la contraseña ayer y hoy no puedo entrar. Pedí el mail de recuperación tres veces y el link me dice que expiró.'],
                    ['customer', 'Necesito entrar hoy porque tengo que descargar una factura.'],
                ],
            ],
            [
                'subject' => 'Me cobraron dos veces la suscripción',
                'requester_name' => 'Martín Salas',
                'requester_email' => 'martin.salas@example.com',
                'status' => 'open',
                'priority' => 'urgent',
                'category' => 'billing',
                'triage_status' => 'done',
                'summary' => 'Aparecen dos cobros de la suscripción mensual en la tarjeta. Hay que verificar si uno es una autorización temporal o un cobro duplicado.',
                'suggested_reply' => 'Hola Martín: recibimos el caso. Revisá si los dos movimientos figuran como “capturados” o si uno está “pendiente”; las autorizaciones temporales se liberan solas. Si ambos están capturados, enviános el ID de pago y la fecha para iniciar el reembolso al mismo medio de pago.',
                'citations' => [$articleIds['Cobros duplicados y reembolsos']],
                'messages' => [
                    ['customer', 'Me aparecen dos cobros iguales de la suscripción. Adjunto los dos IDs: pay_8841 y pay_8842.'],
                ],
            ],
            [
                'subject' => 'El checkout devuelve error 500 al confirmar',
                'requester_name' => 'Sofía Ríos',
                'requester_email' => 'sofia.rios@example.com',
                'status' => 'open',
                'priority' => 'urgent',
                'category' => 'technical',
                'triage_status' => 'done',
                'summary' => 'El checkout falla con error 500 al confirmar el pago. Ocurre en Chrome y en mobile; hay que revisar logs y el límite de subida.',
                'suggested_reply' => 'Hola Sofía: el 500 es un error del servidor. Ya estamos revisando los logs con la hora exacta del intento. Mientras tanto, probá sin archivos adjuntos y contános el navegador, la URL y si el error aparece antes o después de pagar. No reintentes varias veces para evitar cargos duplicados.',
                'citations' => [$articleIds['Error 500 al guardar formularios']],
                'messages' => [
                    ['customer', 'Al confirmar el pago me sale “500 Internal Server Error”. Probé en Chrome y en el celular.'],
                    ['customer', 'El error pasa después de poner los datos de la tarjeta.'],
                ],
            ],
            [
                'subject' => 'Pedido marcado como entregado pero no llegó',
                'requester_name' => 'Diego Molina',
                'requester_email' => 'diego.molina@example.com',
                'status' => 'pending',
                'priority' => 'high',
                'category' => 'shipping',
                'triage_status' => 'done',
                'summary' => 'El transportista marcó el pedido como entregado, pero el cliente no lo recibió. Hay que abrir un reclamo dentro de las 48 horas.',
                'suggested_reply' => 'Hola Diego: revisá con conserje o vecinos y confirmá la dirección de entrega. Si no aparece, abrimos un reclamo con el transportista con el número de pedido; hacelo dentro de las 48 horas desde la marca de entregado. Te vamos a pedir una declaración jurada para iniciar la investigación.',
                'citations' => [$articleIds['Estados de pedido y entregas']],
                'messages' => [
                    ['customer', 'El seguimiento dice entregado ayer a las 16:40 pero no recibí nada. Estaba en casa.'],
                ],
            ],
            [
                'subject' => '¿Cómo exporto mis datos antes de dar de baja la cuenta?',
                'requester_name' => 'Paula Gómez',
                'requester_email' => 'paula.gomez@example.com',
                'status' => 'open',
                'priority' => 'normal',
                'category' => 'account',
                'triage_status' => 'done',
                'summary' => 'La clienta quiere exportar sus datos antes de eliminar la cuenta. La exportación está disponible desde Configuración > Privacidad.',
                'suggested_reply' => 'Hola Paula: podés descargar tus datos desde Configuración > Privacidad > Exportar datos. Incluye perfil, pedidos y mensajes en JSON. La baja es irreversible y conserva solo los registros contables exigidos por ley. Si querés, te acompañamos en el proceso.',
                'citations' => [$articleIds['Exportar datos y eliminar una cuenta']],
                'messages' => [
                    ['customer', 'Quiero irme del servicio pero antes necesito una copia de todo lo que tienen sobre mí.'],
                ],
            ],
            [
                'subject' => 'La API devuelve 429 en el endpoint de pedidos',
                'requester_name' => 'Tomás Herrera',
                'requester_email' => 'tomas.herrera@example.com',
                'status' => 'open',
                'priority' => 'high',
                'category' => 'technical',
                'triage_status' => 'done',
                'summary' => 'La integración supera el límite de 60 requests por minuto y recibe 429. Hay que implementar backoff y revisar el patrón de consumo.',
                'suggested_reply' => 'Hola Tomás: el límite por defecto es de 60 requests por minuto por token. El 429 incluye Retry-After; esperá ese tiempo y usá backoff exponencial en lugar de reintentar en bucle. Si el volumen es esperado, contános el caso de uso para revisar el plan.',
                'citations' => [$articleIds['API: autenticación y límites de uso']],
                'messages' => [
                    ['customer', 'Nuestra integración empezó a recibir 429 desde ayer. Hacemos polling cada segundo.'],
                ],
            ],
            [
                'subject' => 'Necesito la factura con los datos de mi empresa',
                'requester_name' => 'Carolina Pérez',
                'requester_email' => 'carolina.perez@example.com',
                'status' => 'resolved',
                'priority' => 'normal',
                'category' => 'billing',
                'triage_status' => 'done',
                'summary' => 'La clienta necesita una factura con razón social y número de IVA de su empresa. Hay que corregir los datos fiscales.',
                'suggested_reply' => 'Hola Carolina: para corregir la factura enviános la factura original y los datos fiscales correctos (razón social, número de IVA y dirección). Emitimos una nota de crédito con la corrección. No se puede cambiar el titular de una factura ya declarada.',
                'citations' => [$articleIds['Facturas y datos fiscales']],
                'messages' => [
                    ['customer', 'La factura salió a mi nombre pero necesito que salga a nombre de la empresa.'],
                ],
            ],
            [
                'subject' => 'El webhook no llega a mi endpoint',
                'requester_name' => 'Nicolás Vidal',
                'requester_email' => 'nicolas.vidal@example.com',
                'status' => 'open',
                'priority' => 'normal',
                'category' => 'technical',
                'triage_status' => 'pending',
                'summary' => null,
                'suggested_reply' => null,
                'citations' => [],
                'messages' => [
                    ['customer', 'Configuré el webhook pero no veo ninguna entrega. Mi endpoint responde 200 cuando lo pruebo con curl.'],
                ],
            ],
            [
                'subject' => 'No puedo subir un archivo de 20 MB',
                'requester_name' => 'Julián Castro',
                'requester_email' => 'julian.castro@example.com',
                'status' => 'open',
                'priority' => 'normal',
                'category' => 'technical',
                'triage_status' => 'pending',
                'summary' => null,
                'suggested_reply' => null,
                'citations' => [],
                'messages' => [
                    ['customer', 'El formulario me dice que el archivo es demasiado grande. Es un ZIP de 20 MB.'],
                ],
            ],
            [
                'subject' => 'Quiero cambiar el email de mi cuenta',
                'requester_name' => 'Elena Ruiz',
                'requester_email' => 'elena.ruiz@example.com',
                'status' => 'resolved',
                'priority' => 'low',
                'category' => 'account',
                'triage_status' => 'done',
                'summary' => 'La clienta perdió acceso al email anterior y necesita actualizar el correo de la cuenta.',
                'suggested_reply' => 'Hola Elena: para cambiar el email necesitamos verificar tu identidad. Enviános desde el formulario de contacto una foto del documento y el email nuevo. Después del cambio te vamos a pedir que confirmes el acceso desde el nuevo correo.',
                'citations' => [$articleIds['Restablecer contraseña y recuperar el acceso']],
                'messages' => [
                    ['customer', 'Ya no tengo acceso al mail viejo. ¿Puedo poner uno nuevo?'],
                ],
            ],
            [
                'subject' => 'Consulta sobre planes y límites',
                'requester_name' => 'Federico Lemos',
                'requester_email' => 'federico.lemos@example.com',
                'status' => 'resolved',
                'priority' => 'low',
                'category' => 'billing',
                'triage_status' => 'done',
                'summary' => 'El cliente pregunta por los límites del plan antes de contratar. La respuesta debe basarse en la información comercial vigente.',
                'suggested_reply' => 'Hola Federico: el plan actual incluye 60 requests por minuto por token y 25 MB por formulario. Si me contás el volumen y el caso de uso, te paso una comparación concreta de planes. No quiero darte un precio que no esté confirmado.',
                'citations' => [$articleIds['API: autenticación y límites de uso']],
                'messages' => [
                    ['customer', 'Antes de contratar quiero saber cuántas requests incluye y qué pasa si me paso.'],
                ],
            ],
        ];

        $days = 0;
        foreach ($tickets as $index => $data) {
            $messages = $data['messages'];
            unset($data['messages']);
            $data['channel'] = 'email';
            $data['ai_model'] = $data['triage_status'] === 'done' ? 'deepseek-chat' : null;
            $data['triaged_at'] = $data['triage_status'] === 'done' ? now()->subDays($days)->subMinutes(3) : null;
            $data['created_at'] = now()->subDays($days)->subMinutes(10);
            $data['updated_at'] = now()->subDays($days)->subMinutes(2);

            $ticket = Ticket::create($data);
            $messageTime = $ticket->created_at;
            foreach ($messages as [$author, $body]) {
                $ticket->messages()->create([
                    'author' => $author,
                    'body' => $body,
                    'created_at' => $messageTime,
                    'updated_at' => $messageTime,
                ]);
                $messageTime = $messageTime->copy()->addMinutes(2);
            }
            $days++;
        }
    }
}
