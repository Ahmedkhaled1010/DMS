import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ConfirmDialogModule } from "primeng/confirmdialog" // Import ConfirmDialogModule

// PrimeNG Imports
import { CardModule } from "primeng/card"
import { ButtonModule } from "primeng/button"
import { ProgressSpinnerModule } from "primeng/progressspinner"
import { ToastModule } from "primeng/toast"
import { MessageService ,ConfirmationService} from "primeng/api"
import { DocumentService } from "../../Services/Document/document.service"
import { Document, DocumentModel, Privacy } from "../../Interfaces/Document/document"
import { TranslateModule } from "@ngx-translate/core"
DocumentService
@Component({
  selector: 'app-deleted-document',
  standalone: true,
   imports: [CommonModule, CardModule, ButtonModule,ConfirmDialogModule, ProgressSpinnerModule, ToastModule,TranslateModule],
  providers: [MessageService,ConfirmationService], // لتوفير خدمة الرسائ
  templateUrl: './deleted-document.component.html',
  styleUrl: './deleted-document.component.scss'
})
export class DeletedDocumentComponent {
  Privacy?:Privacy ;
 deletedDocuments: DocumentModel[] = []
  loading = true
  error: string | null = null
  restoringDocumentId: string | null = null // لتتبع المستند الذي يتم استعادته
  deletingDocumentId: string | null = null // لتتبع المستند الذي يتم حذفه نها
  constructor(
    private documentService: DocumentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.fetchDeletedDocuments()
  }

  fetchDeletedDocuments(): void {
    this.loading = true
    this.error = null
    this.documentService
      .getAllDeletedDocuments().subscribe(
        {
          next:(res)=>{
            console.log(res);
            this.deletedDocuments = res.data
            this.loading = false
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
          severity: "error",
          summary: "Error",
        })
        this.loading = false
            
          }
        }
      )
    /*
        .then((docs) => {
        this.deletedDocuments = docs
        this.loading = false
      })
      .catch((err) => {
        this.error = "Failed to load deleted documents."
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: this.error,
        })
        this.loading = false
      })
      */
  }

   restoreDocument(id: string) {

    this.documentService.restoreDocument(id).subscribe({
      next: (res) => {
        console.log(res);
            this.fetchDeletedDocuments()

      },
      error: (err) => {
        console.error("Error restoring document:", err)
        this.messageService.add({
          severity: "error",
          summary: "Restore Failed",
          detail: "Could not restore document. Please try again.",
        })
      }});
    

    /*this.restoringDocumentId = id
    try {
      const success = await this.documentService.restoreDocument(id)
      if (success) {
        // تحديث القائمة بعد الاستعادة
        this.deletedDocuments = this.deletedDocuments.filter((doc) => doc.id !== id)
      }
    } catch (err) {
      console.error("Error restoring document:", err)
      this.messageService.add({
        severity: "error",
        summary: "Restore Failed",
        detail: "Could not restore document. Please try again.",
      })
    } finally {
      this.restoringDocumentId = null
    }*/
  }
  confirmPermanentDelete(event: Event, id: string, name: string): void {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: `هل أنت متأكد أنك تريد حذف المستند "${name}" نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.`,
          icon: "pi pi-exclamation-triangle",
          acceptLabel: "نعم، احذف",
          rejectLabel: "إلغاء",
          acceptButtonStyleClass: "p-button-danger p-button-sm",
          rejectButtonStyleClass: "p-button-text p-button-sm",
          accept: () => {
            this.deleteDocumentPermanently(id);

          },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "تم الإلغاء",
          detail: "تم إلغاء عملية الحذف.",
        })
      },
    })
  }

  async deleteDocumentPermanently(id: string): Promise<void> {
    this.deletingDocumentId = id
    this.documentService.deleteMetaData(id).subscribe({
      next:(res)=>{
        console.log(res);
         this.deletingDocumentId = null
                            this.fetchDeletedDocuments()

      },
      error: (err) => {
        console.error("Error deleting document permanently:", err)
        this.messageService.add({
          severity: "error",
          summary: "حذف فشل",
          detail: "تعذر حذف المستند نهائيًا. يرجى المحاولة مرة أخرى.",
        })
      }
    })
   /* try {
      const success = await this.documentService.deleteDocumentPermanently(id)
      if (success) {
        // تحديث القائمة بعد الحذف النهائي
        this.deletedDocuments = this.deletedDocuments.filter((doc) => doc.id !== id)
      }
    } catch (err) {
      console.error("Error deleting document permanently:", err)
      this.messageService.add({
        severity: "error",
        summary: "فشل الحذف",
        detail: "تعذر حذف المستند نهائيًا. يرجى المحاولة مرة أخرى.",
      })
    } finally {
      this.deletingDocumentId = null
    }*/
  }
}
