from django.db import models

#Client model with cedula as pk
class Client(models.Model):
    cedula = models.CharField(primary_key=True, max_length=32)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
#One to many client email representation
class ClientEmail(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='emails')
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.client.name} {self.email}"

#One to many client phone representation
class ClientPhone(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='phones')
    phone = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.client.name} ({self.phone})"
    
#Project table
class Project(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=160)
    total = models.DecimalField(max_digits=30, decimal_places=2, blank=True, null=True)
    clients = models.ManyToManyField(Client , through='ClientProject')

    def __str__(self):
        return f"{self.name} ({self.location})"

#Junction table with clients and projects
class ClientProject(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    role_name = models.CharField(max_length=45)

    class Meta:
        unique_together = (('client', 'project'))

#Phases with one to many relation with projects
class Phase(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='phases')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    total = models.DecimalField(max_digits=30, decimal_places=2, blank=True, null=True)
    duration = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} {self.project}"

#PhaseInterval with one to many relation with a phase
class PhaseInterval(models.Model):
    phase = models.ForeignKey(Phase, on_delete=models.CASCADE, related_name='intervals')
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Interval of {self.phase} that started on {self.start_date} "
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        phase = self.phase
        intervals = PhaseInterval.objects.filter(phase=phase)
        total_days = 0
        for interval in intervals:
            if interval.start_date and interval.end_date:
                total_days += (interval.end_date - interval.start_date).days
        phase.duration = total_days if total_days > 0 else None
        phase.save()

    def delete(self, *args, **kwargs):
        phase = self.phase
        super().delete(*args, **kwargs)
        intervals = PhaseInterval.objects.filter(phase=phase)
        total_days = 0
        for interval in intervals:
            if interval.start_date and interval.end_date:
                total_days += (interval.end_date - interval.start_date).days
        phase.duration = total_days if total_days > 0 else None
        phase.save()
    
#Supplier table with nit as pk
class Supplier(models.Model):
    nit = models.CharField(primary_key=True , max_length=32)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=160)
    type = models.CharField(max_length=50)
    bank_account = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name}"
    
# SupplierPhone one to many relation  
class SupplierPhone(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='phones')
    phone = models.CharField(max_length=20 , unique=True)

    def __str__(self):
        return f"{self.supplier.name} {self.phone}"
    
#Material class with Many to many relation with provider and phase
class Material(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    phases = models.ManyToManyField(Phase , through='PhaseMaterial')
    providers = models.ManyToManyField(Supplier , through='SupplierMaterial')

    def __str__(self):
        return self.name

#Phase material junction table
class PhaseMaterial(models.Model):
    phase = models.ForeignKey(Phase, on_delete=models.CASCADE)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    unit_price_estimated = models.DecimalField(max_digits=30, decimal_places=2)
    quantity_estimated = models.DecimalField(max_digits=30, decimal_places=2)

    class Meta:
        unique_together = (('phase', 'material'),)

    def __str__(self):
        return f"{self.material.name} for {self.phase.name}"

#junction table of many to many supplier material    
class SupplierMaterial(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    actual_price = models.DecimalField(max_digits=30, decimal_places=2)
    unit_of_measure = models.CharField(max_length=50)

    class Meta:
        unique_together = (('supplier', 'material'),)

    def __str__(self):
        return f"{self.material.name} from {self.supplier.name}"

#Quote with one to many relation with phases and many to many relation with materials
class Quote(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("completed", "Completed"),
    ]
    phase = models.ForeignKey(Phase, on_delete=models.CASCADE, related_name='quotes')
    quote_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    is_first_quote = models.BooleanField()
    total = models.DecimalField(max_digits=30, decimal_places=2, blank=True, null=True)
    materials = models.ManyToManyField(SupplierMaterial , through='QuoteSupplierMaterial')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")

    def __str__(self):
        return f"Quote {self.pk} for {self.phase_id}"
    
#Many to many junction table with Quotes and SupplierMaterial
class QuoteSupplierMaterial(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    supplierMaterial = models.ForeignKey(SupplierMaterial, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=30, decimal_places=2) #Should be an integer
    unit_price = models.DecimalField(max_digits=30, decimal_places=2)
    subtotal = models.DecimalField(max_digits=30, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"{self.supplierMaterial.material.name} from {self.supplierMaterial.supplier.name}- Quantity: {self.quantity}"

#Worker class with cedula as pk           
class Worker(models.Model):
    cedula = models.CharField(primary_key=True, max_length=32)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    quotes = models.ManyToManyField(Quote , through='QuoteWorker')

    def __str__(self):
        return f"{self.first_name} ({self.cedula})"

#One to many relation of phones with worker 
class WorkerPhone(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='phones')
    phone = models.CharField(max_length=20 , unique=True)

    def __str__(self):
        return f"{self.phone} ({self.cedula})"

#Junction table for worker and quote
class QuoteWorker(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('quote', 'worker'),)

    def __str__(self):
        return f"{self.worker.name} for {self.quote.pk}"