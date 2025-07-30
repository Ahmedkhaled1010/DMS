import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"

// PrimeNG Imports
import { CardModule } from "primeng/card"
import { ButtonModule } from "primeng/button"
import { ProgressSpinnerModule } from "primeng/progressspinner"
import { ToastModule } from "primeng/toast"
import { ConfirmDialogModule } from "primeng/confirmdialog"
import { MessageService, ConfirmationService } from "primeng/api"
import { DocumentService } from "../../Services/Document/document.service"
import { Document, DocumentModel } from "../../Interfaces/Document/document"
import { TranslateModule } from "@ngx-translate/core"

@Component({
  selector: 'app-archive-document',
  standalone: true,
 imports: [CommonModule, CardModule,TranslateModule, ButtonModule, ProgressSpinnerModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './archive-document.component.html',
  styleUrl: './archive-document.component.scss'
})
export class ArchiveDocumentComponent {
archivedDocuments: DocumentModel[] = []
  loading = true
  error: string | null = null
  restoringDocumentId: string | null = null // To track the document being restored

  constructor(
    private documentService: DocumentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.fetchArchivedDocuments()
  }

  fetchArchivedDocuments(): void {
    this.loading = true
    this.error = null
    this.documentService
      .getAllArchivedDocuments().subscribe({
        next: (response) => {console.log(response);

           this.archivedDocuments = response.data
        this.loading = false
        },
        error:(err)=>{console.log(err);
        }});
      /*.then((docs) => {
        this.archivedDocuments = docs
        this.loading = false
      })
      .catch((err) => {
        this.error = "فشل تحميل المستندات المؤرشفة."
        this.messageService.add({
          severity: "error",
          summary: "خطأ",
          detail: this.error,
        })
        this.loading = false
      })*/
  }

  

  
  
}
