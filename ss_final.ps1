Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Take-Screenshot($filename) {
    Start-Sleep -Seconds 4
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
    $bitmap.Save("C:\workspaces\credit-loan-system\$filename")
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Output "Saved $filename"
}

# Dashboard
Take-Screenshot "final_dashboard.png"

# Loan Apply
Start-Process "http://localhost:3001/loans/apply"
Take-Screenshot "final_apply.png"

# Contracts
Start-Process "http://localhost:3001/loans/contracts"
Take-Screenshot "final_contracts.png"

# Contract Detail
Start-Process "http://localhost:3001/loans/contracts/1"
Take-Screenshot "final_contract_detail.png"

Write-Output "All done"
