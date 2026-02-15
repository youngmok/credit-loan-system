Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Take-Screenshot($filename) {
    Start-Sleep -Seconds 3
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
    $bitmap.Save("C:\workspaces\credit-loan-system\$filename")
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Output "Saved $filename"
}

# Page 1: Loan Apply
Start-Process "http://localhost:3001/loans/apply"
Take-Screenshot "ss_apply.png"

# Page 2: Applications List
Start-Process "http://localhost:3001/loans/applications"
Take-Screenshot "ss_applications.png"

# Page 3: Contracts List
Start-Process "http://localhost:3001/loans/contracts"
Take-Screenshot "ss_contracts.png"

# Page 4: Contract Detail (id=1)
Start-Process "http://localhost:3001/loans/contracts/1"
Take-Screenshot "ss_contract_detail.png"

# Page 5: Application Detail (id=1)
Start-Process "http://localhost:3001/loans/applications/1"
Take-Screenshot "ss_app_detail.png"

Write-Output "All screenshots done"
