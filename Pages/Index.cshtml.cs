using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ERP_Fix;

namespace ERP_UI.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;

    public string ArticlesAddBtnClass { get; set; } = "";
    public string PriceListsAddBtnClass { get; set; } = "";
    public string OrdersAddBtnClass { get; set; } = "";
    public string BillsAddBtnClass { get; set; } = "";

    public string ModalState = "modal-hidden";

    ERPManager erpManager = new();

    public IndexModel(ILogger<IndexModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {
        Disabling();
    }

    public void ShowModal()
    {
        ModalState = "modal-visible";
    }

    public void Disabling()
    {
        ArticlesAddBtnClass = "";
        PriceListsAddBtnClass = "";
        OrdersAddBtnClass = "";
        BillsAddBtnClass = "";

        if (erpManager.GetArticleTypeCount() <= 0)
            ArticlesAddBtnClass += " disabled-btn";
        if (erpManager.GetArticleTypeCount() <= 0)
            PriceListsAddBtnClass += " disabled-btn";
        if (erpManager.GetArticleTypeCount() <= 0 || erpManager.GetPricesCount() <= 0)
            OrdersAddBtnClass += " disabled-btn";
        if (erpManager.GetOrderCount() <= 0)
            BillsAddBtnClass += " disabled-btn";
    }

    public void AddArticleType(string name)
    {
        erpManager.NewArticleType(name);
        Disabling();
    }
}
