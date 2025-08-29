from django.contrib import admin

from .models import (
    Client,
    ClientEmail,
    ClientPhone,
    ClientProject,
    Material,
    Phase,
    PhaseInterval,
    PhaseMaterial,
    Project,
    QuoteSupplierMaterial,
    QuoteWorker,
    Quote,
    Supplier,
    SupplierMaterial,
    SupplierPhone,
    Worker,
    WorkerPhone,
)

admin.site.register(Client)
admin.site.register(ClientEmail)
admin.site.register(ClientPhone)
admin.site.register(ClientProject)
admin.site.register(Material)
admin.site.register(Phase)
admin.site.register(PhaseInterval)
admin.site.register(PhaseMaterial)
admin.site.register(Project)
admin.site.register(QuoteSupplierMaterial)
admin.site.register(QuoteWorker)
admin.site.register(Quote)
admin.site.register(Supplier)
admin.site.register(SupplierMaterial)
admin.site.register(SupplierPhone)
admin.site.register(Worker)
admin.site.register(WorkerPhone)





