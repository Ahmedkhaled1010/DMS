import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"

// PrimeNG Imports
import { CardModule } from "primeng/card"
import { ButtonModule } from "primeng/button"
import { ProgressSpinnerModule } from "primeng/progressspinner"
import { ToastModule } from "primeng/toast"
import { MessageService } from "primeng/api"
import { DocumentModel } from "../../Interfaces/Document/document"
import { DocumentService } from "../../Services/Document/document.service"
@Component({
  selector: 'app-shareddocument',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ProgressSpinnerModule, ToastModule],
  providers: [MessageService],
  templateUrl: './shareddocument.component.html',
  styleUrl: './shareddocument.component.scss'
})
export class ShareddocumentComponent {
sharedDocuments: DocumentModel[] = []
  loading = true
  error: string | null = null

  constructor(
    private documentService: DocumentService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.fetchSharedDocuments()
  }

  fetchSharedDocuments(): void {
    this.loading = true
    this.error = null
    this.documentService.getAllSharedWithMeDocuments().subscribe({
      next: (response) => {
         this.sharedDocuments = response.data
        this.loading = false
      }
      ,error: (err) => {
        console.error(err)}});
      /*.getSharedWithMeDocuments()
      .then((docs) => {
        this.sharedDocuments = docs
        this.loading = false
      })
      .catch((err) => {
        this.error = "فشل تحميل المستندات المشتركة معي."
        this.messageService.add({
          severity: "error",
          summary: "خطأ",
          detail: this.error,
        })
        this.loading = false
      })*/
  }
}
