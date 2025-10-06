import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { templateHelpers } from './helpers/template.helpers';

const execPromise = promisify(exec);

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  private readonly gotenbergUrl: string;
  private readonly templatesPath: string;

  constructor(private configService: ConfigService) {
    this.gotenbergUrl = this.configService.get<string>('GOTENBERG_URL');
    this.templatesPath = path.join(__dirname, 'templates');

    // Register all Handlebars helpers
    this.registerHelpers();
  }

  /**
   * Register custom Handlebars helpers
   */
  private registerHelpers(): void {
    Object.keys(templateHelpers).forEach((helperName) => {
      Handlebars.registerHelper(helperName, templateHelpers[helperName]);
    });

    this.logger.log(`Registered ${Object.keys(templateHelpers).length} Handlebars helpers`);
  }

  async generatePdfFromHtml(html: string, options?: {
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    paperWidth?: string;
    paperHeight?: string;
  }): Promise<Buffer> {
    try {
      // Windows/Docker networking workaround: use curl via child_process
      const tempDir = path.join(__dirname, '..', '..', '..', 'tmp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const timestamp = Date.now();
      const htmlFile = path.join(tempDir, `temp_${timestamp}.html`);
      const pdfFile = path.join(tempDir, `temp_${timestamp}.pdf`);

      // Write HTML to temp file
      fs.writeFileSync(htmlFile, html);

      this.logger.debug(`Sending request to Gotenberg: ${this.gotenbergUrl}`);

      // Build curl command
      const marginTop = options?.marginTop || '0.5';
      const marginBottom = options?.marginBottom || '0.5';
      const marginLeft = options?.marginLeft || '0.5';
      const marginRight = options?.marginRight || '0.5';

      let curlCommand = `curl -s -X POST "${this.gotenbergUrl}/forms/chromium/convert/html" ` +
        `-F "files=@${htmlFile};filename=index.html" ` +
        `-F "marginTop=${marginTop}" ` +
        `-F "marginBottom=${marginBottom}" ` +
        `-F "marginLeft=${marginLeft}" ` +
        `-F "marginRight=${marginRight}"`;

      if (options?.paperWidth) {
        curlCommand += ` -F "paperWidth=${options.paperWidth}"`;
      }
      if (options?.paperHeight) {
        curlCommand += ` -F "paperHeight=${options.paperHeight}"`;
      }

      curlCommand += ` -o "${pdfFile}" --max-time 30`;

      // Execute curl command
      await execPromise(curlCommand);

      // Read PDF file
      if (!fs.existsSync(pdfFile)) {
        throw new Error('PDF file was not created');
      }

      const pdfBuffer = fs.readFileSync(pdfFile);

      // Cleanup temp files
      fs.unlinkSync(htmlFile);
      fs.unlinkSync(pdfFile);

      this.logger.log('PDF generated successfully');
      return pdfBuffer;
    } catch (error) {
      this.logger.error('Failed to generate PDF', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  /**
   * Render template with data
   */
  private renderTemplate(templateName: string, data: any): string {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.hbs`);

      if (!fs.existsSync(templatePath)) {
        this.logger.warn(`Template not found: ${templatePath}, using legacy HTML generation`);
        return this.generateQuestionnaireHtml(data);
      }

      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const template = Handlebars.compile(templateSource);
      const html = template(data);

      this.logger.log(`Template ${templateName} rendered successfully`);
      return html;
    } catch (error) {
      this.logger.error(`Failed to render template ${templateName}:`, error);
      throw new Error(`Template rendering failed: ${error.message}`);
    }
  }

  /**
   * Generate PDF from questionnaire data using template
   */
  async generateQuestionnairePdf(data: any): Promise<Buffer> {
    const html = this.renderTemplate('questionnaire', data);
    return this.generatePdfFromHtml(html, {
      marginTop: '0.4',
      marginBottom: '0.4',
      marginLeft: '0.6',
      marginRight: '0.6',
    });
  }

  /**
   * Generate PDF from consent data using template
   */
  async generateConsentPdf(data: any): Promise<Buffer> {
    const html = this.renderTemplate('consent', {
      ...data,
      currentDate: new Date(),
    });
    return this.generatePdfFromHtml(html, {
      marginTop: '0.5',
      marginBottom: '0.5',
      marginLeft: '0.6',
      marginRight: '0.6',
    });
  }

  private generateQuestionnaireHtml(data: any): string {
    const {
      candidate,
      birthDate,
      birthPlace,
      passportSeries,
      passportNumber,
      passportIssuer,
      passportIssuerCode,
      passportIssueDate,
      registrationAddress,
      actualAddress,
      actualAddressSameAsRegistration,
      education,
      workExperience,
      createdAt,
    } = data;

    const formatDate = (date: string) => {
      if (!date) return 'Не указано';
      return new Date(date).toLocaleDateString('ru-RU');
    };

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Анкета кандидата</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #333;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
        }

        .header h1 {
            font-size: 24pt;
            color: #2563eb;
            margin-bottom: 10px;
        }

        .header .date {
            font-size: 10pt;
            color: #666;
        }

        .section {
            margin-bottom: 25px;
        }

        .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e5e7eb;
        }

        .field {
            margin-bottom: 12px;
            display: flex;
            page-break-inside: avoid;
        }

        .field-label {
            font-weight: 600;
            color: #4b5563;
            min-width: 200px;
            flex-shrink: 0;
        }

        .field-value {
            color: #1f2937;
            flex: 1;
        }

        .subsection {
            margin-top: 15px;
            margin-bottom: 15px;
            padding: 15px;
            background-color: #f9fafb;
            border-left: 3px solid #2563eb;
        }

        .subsection-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 10px;
        }

        .list-item {
            margin-bottom: 15px;
            padding: 10px;
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 9pt;
            color: #6b7280;
        }

        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>АНКЕТА КАНДИДАТА</h1>
        <div class="date">Дата создания: ${formatDate(createdAt)}</div>
    </div>

    <div class="section">
        <div class="section-title">1. Личные данные</div>
        <div class="field">
            <div class="field-label">ФИО:</div>
            <div class="field-value">${candidate?.lastName || ''} ${candidate?.firstName || ''} ${candidate?.middleName || ''}</div>
        </div>
        <div class="field">
            <div class="field-label">Дата рождения:</div>
            <div class="field-value">${formatDate(birthDate)}</div>
        </div>
        <div class="field">
            <div class="field-label">Место рождения:</div>
            <div class="field-value">${birthPlace || 'Не указано'}</div>
        </div>
        <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${candidate?.email || 'Не указано'}</div>
        </div>
        <div class="field">
            <div class="field-label">Телефон:</div>
            <div class="field-value">${candidate?.phone || 'Не указано'}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">2. Паспортные данные</div>
        <div class="field">
            <div class="field-label">Серия и номер:</div>
            <div class="field-value">${passportSeries || ''} ${passportNumber || ''}</div>
        </div>
        <div class="field">
            <div class="field-label">Кем выдан:</div>
            <div class="field-value">${passportIssuer || 'Не указано'}</div>
        </div>
        <div class="field">
            <div class="field-label">Код подразделения:</div>
            <div class="field-value">${passportIssuerCode || 'Не указано'}</div>
        </div>
        <div class="field">
            <div class="field-label">Дата выдачи:</div>
            <div class="field-value">${formatDate(passportIssueDate)}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">3. Адреса</div>
        <div class="field">
            <div class="field-label">Адрес регистрации:</div>
            <div class="field-value">${registrationAddress || 'Не указано'}</div>
        </div>
        <div class="field">
            <div class="field-label">Адрес проживания:</div>
            <div class="field-value">${actualAddressSameAsRegistration ? 'Совпадает с адресом регистрации' : (actualAddress || 'Не указано')}</div>
        </div>
    </div>

    ${education && education.length > 0 ? `
    <div class="section">
        <div class="section-title">4. Образование</div>
        ${education.map((edu: any, index: number) => `
        <div class="subsection">
            <div class="subsection-title">Учебное заведение ${index + 1}</div>
            <div class="field">
                <div class="field-label">Название:</div>
                <div class="field-value">${edu.institution || 'Не указано'}</div>
            </div>
            <div class="field">
                <div class="field-label">Специальность:</div>
                <div class="field-value">${edu.specialty || 'Не указано'}</div>
            </div>
            <div class="field">
                <div class="field-label">Период обучения:</div>
                <div class="field-value">${edu.startYear || ''} - ${edu.endYear || ''}</div>
            </div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${workExperience && workExperience.length > 0 ? `
    <div class="section">
        <div class="section-title">5. Опыт работы</div>
        ${workExperience.map((work: any, index: number) => `
        <div class="subsection">
            <div class="subsection-title">Место работы ${index + 1}</div>
            <div class="field">
                <div class="field-label">Организация:</div>
                <div class="field-value">${work.company || 'Не указано'}</div>
            </div>
            <div class="field">
                <div class="field-label">Должность:</div>
                <div class="field-value">${work.position || 'Не указано'}</div>
            </div>
            <div class="field">
                <div class="field-label">Период:</div>
                <div class="field-value">${formatDate(work.startDate)} - ${work.isCurrent ? 'по настоящее время' : formatDate(work.endDate)}</div>
            </div>
            ${work.responsibilities ? `
            <div class="field">
                <div class="field-label">Обязанности:</div>
                <div class="field-value">${work.responsibilities}</div>
            </div>
            ` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="footer">
        <p>Документ сгенерирован автоматически системой AFI</p>
        <p>Дата создания: ${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU')}</p>
    </div>
</body>
</html>
    `;
  }
}
