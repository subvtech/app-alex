export function getEmailConfirmationTemplate({
  url,
  username,
}: {
  url: string;
  username: string;
}) {
  return /* html */ `
    <!doctype html>
    <html
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      lang="en"
    >
      <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!--[if mso
          ]><xml
            ><o:OfficeDocumentSettings
              ><o:PixelsPerInch>96</o:PixelsPerInch
              ><o:AllowPNG /></o:OfficeDocumentSettings></xml
        ><![endif]-->
        <!--[if !mso]><!-->
        <link
          href="https://fonts.googleapis.com/css2?family=Cabin:wght@100;200;300;400;500;600;700;800;900"
          rel="stylesheet"
          type="text/css"
        />
        <!--<![endif]-->
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
          }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
          }
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
          }
          p {
            line-height: inherit;
          }
          .desktop_hide,
          .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
          }
          .image_block img + div {
            display: none;
          }
          @media (max-width: 720px) {
            .desktop_hide table.icons-inner {
              display: inline-block !important;
            }
            .icons-inner {
              text-align: center;
            }
            .icons-inner td {
              margin: 0 auto;
            }
            .image_block div.fullWidth {
              max-width: 100% !important;
            }
            .mobile_hide {
              display: none;
            }
            .row-content {
              width: 100% !important;
            }
            .stack .column {
              width: 100%;
              display: block;
            }
            .mobile_hide {
              min-height: 0;
              max-height: 0;
              max-width: 0;
              overflow: hidden;
              font-size: 0px;
            }
            .desktop_hide,
            .desktop_hide table {
              display: table !important;
              max-height: none !important;
            }
          }
        </style>
      </head>
      <body style="background-color: #f9f9f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
        <table
          class="nl-container"
          width="100%"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f9f9f9;"
        >
          <tbody>
            <tr>
              <td>
                <table
                  class="row row-1"
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #d1f6fa;"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          class="row-content stack"
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px; margin: 0 auto;"
                          width="700"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="column column-1"
                                width="100%"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; padding-top: 10px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                              >
                                <table
                                  class="image_block block-1"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                >
                                  <tr>
                                    <td
                                      class="pad"
                                      style="width:100%;padding-right:0px;padding-left:0px;"
                                    >
                                      <div
                                        class="alignment"
                                        align="center"
                                        style="line-height:10px"
                                      >
                                        <div style="max-width: 195px;">
                                          <img
                                            src="https://alexproject.nyc3.digitaloceanspaces.com/strapi-test/2cfce956583ecbb1e93b94dbf36a23eb.png"
                                            style="display: block; height: auto; border: 0; width: 100%;"
                                            width="140"
                                            alt="Alex Logo"
                                            title="Alex Logo"
                                          />
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  class="row row-2"
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #d1f6fa;"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          class="row-content stack"
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; border-radius: 8px 8px 0 0; color: #000000; width: 700px; margin: 0 auto;"
                          width="700"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="column column-1"
                                width="100%"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                              >
                                <div
                                  class="spacer_block block-1"
                                  style="height:30px;line-height:30px;font-size:1px;"
                                >
                                  &#8202;
                                </div>
                                <table
                                  class="image_block block-2"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                >
                                  <tr>
                                    <td
                                      class="pad"
                                      style="width:100%;padding-right:0px;padding-left:0px;"
                                    >
                                      <div
                                        class="alignment"
                                        align="center"
                                        style="line-height:10px"
                                      >
                                        <div
                                          class="fullWidth"
                                          style="max-width: 420px;"
                                        >
                                          <img
                                            src="https://alexproject.nyc3.digitaloceanspaces.com/strapi-test/30363f52492aae3f8cf7f931688e7199.png"
                                            style="display: block; height: auto; border: 0; width: 100%;"
                                            width="420"
                                            alt="Imagem de confirmação do email"
                                            title="I'm an image"
                                          />
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table
                                  class="paragraph_block block-3"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                >
                                  <tr>
                                    <td
                                      class="pad"
                                      style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;"
                                    >
                                      <div
                                        style="color:#00b7cc;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:38px;line-height:150%;text-align:center;mso-line-height-alt:57px;"
                                      >
                                        <p style="margin: 0; word-break: break-word;">
                                          <strong><span>Olá ${username}!,</span></strong>
                                        </p>
                                        <p style="margin: 0; word-break: break-word;">
                                          <strong><span>Bem Vindo ao ALEX!</span></strong>
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table
                                  class="paragraph_block block-4"
                                  width="100%"
                                  border="0"
                                  cellpadding="10"
                                  cellspacing="0"
                                  role="presentation"
                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                >
                                  <tr>
                                    <td class="pad">
                                      <div
                                        style="color:#042749;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:22px;line-height:120%;text-align:center;mso-line-height-alt:26.4px;"
                                      >
                                        <p style="margin: 0; word-break: break-word;">
                                          Para concluir o registro, por favor, valide seu endereço de
                                        </p>
                                        <p style="margin: 0; word-break: break-word;">
                                          e-mail clicando no botão fornecido abaixo:
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table
                                  class="button_block block-5"
                                  width="100%"
                                  border="0"
                                  cellpadding="10"
                                  cellspacing="0"
                                  role="presentation"
                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                >
                                  <tr>
                                    <td class="pad">
                                      <div class="alignment" align="center">
                                        <!--[if mso]>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.netflix.com/watch/81498825?trackId=155573558" style="height:48px;width:200px;v-text-anchor:middle;" arcsize="17%" stroke="false" fillcolor="#00b7cc">
  <w:anchorlock/>
  <v:textbox inset="0px,0px,0px,0px">
  <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:14px">
  <!
                                        [endif]-->
                                        <a
                                          href="${url}"
                                          target="_blank"
                                          style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#00b7cc;border-radius:8px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:10px;padding-bottom:10px;font-family:'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:14px;text-align:center;mso-border-alt:none;word-break:keep-all;"
                                          >
                                          <span style="padding-left:40px;padding-right:40px;font-size:14px;display:inline-block;letter-spacing:normal;">
                                            <span style="word-break: break-word; line-height: 28px;">
                                              Confirme seu e-mail
                                            </span>
                                          </span>
                                        </a><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  class="row row-3"
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #d1f6fa;"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          class="row-content stack"
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #ffffff; border-radius: 0 0 8px 8px; width: 700px; margin: 0 auto;"
                          width="700"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="column column-1"
                                width="100%"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                              >
                                <table
                                  class="divider_block block-1"
                                  width="100%"
                                  border="0"
                                  cellpadding="10"
                                  cellspacing="0"
                                  role="presentation"
                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                >
                                  <tr>
                                    <td class="pad">
                                      <div class="alignment" align="center">
                                        <table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          role="presentation"
                                          width="70%"
                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                        >
                                          <tr>
                                            <td
                                              class="divider_inner"
                                              style="font-size: 1px; line-height: 1px; border-top: 1px solid #00B7CC;"
                                            >
                                              <span>&#8202;</span>
                                            </td>
                                          </tr>
                                        </table>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table
                                  class="paragraph_block block-2"
                                  width="100%"
                                  border="0"
                                  cellpadding="10"
                                  cellspacing="0"
                                  role="presentation"
                                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                >
                                  <tr>
                                    <td class="pad">
                                      <div
                                        style="color:#00b7cc;direction:ltr;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;font-weight:700;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:19.2px;"
                                      >
                                        <p style="margin: 0;">
                                          Projeto ALEX ©&nbsp;
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  class="row row-4"
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #d1f6fa;"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          class="row-content stack"
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px; margin: 0 auto;"
                          width="700"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="column column-1"
                                width="100%"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                              >
                                <div
                                  class="spacer_block block-1"
                                  style="height:20px;line-height:20px;font-size:1px;"
                                >
                                  &#8202;
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- End -->
      </body>
    </html>
  `;
}
